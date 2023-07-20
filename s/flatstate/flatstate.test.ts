
import {Suite, expect} from "cynic"
import {Flatstate} from "./flatstate.js"

export default <Suite>{

	async "we can increment a count"() {
		const flat = new Flatstate()
		const state = flat.state({count: 0})
		expect(state.count).equals(0)
		state.count += 1
		await flat.wait
		expect(state.count).equals(1)
	},

	async "we can react to a changed property"() {
		const flat = new Flatstate()
		const state = flat.state({count: 0})
		let responder_calls = 0
		flat.reaction(
			() => ({count: state.count}),
			() => { responder_calls += 1 },
		)
		expect(responder_calls).equals(0)
		expect(state.count).equals(0)
		state.count = 123
		await flat.wait
		expect(state.count).equals(123)
		expect(responder_calls).equals(1)
	},

	async "reaction with only one function"() {
		const flat = new Flatstate()
		const state = flat.state({count: 0})
		let responder_calls = 0
		flat.reaction(() => {
			void state.count
			responder_calls += 1
		})
		expect(responder_calls).equals(1)
		expect(state.count).equals(0)
		state.count = 123
		await flat.wait
		expect(state.count).equals(123)
		expect(responder_calls).equals(2)
	},

	async "reaction collector can pass data to responder"() {
		const flat = new Flatstate()
		const state = flat.state({count: 0, greeting: "hello"})
		let responder_count: number = -1
		let responder_greeting: string = ""
		flat.reaction(
			() => ({count: state.count, greeting: state.greeting}),
			({count, greeting}) => {
				responder_count = count
				responder_greeting = greeting
			},
		)
		expect(responder_count).equals(-1)
		expect(responder_greeting).equals("")
		state.count++
		state.greeting = "hello world"
		await flat.wait
		expect(responder_count).equals(1)
		expect(responder_greeting).equals("hello world")
	},

	async "reaction_core is efficient"() {
		const flat = new Flatstate()
		const state = flat.state({count: 0})
		let collections = 0
		let responses = 0
		flat.reaction_core(
			() => {
				void state.count
				collections++
			},
			() => {
				void state.count
				responses++
			}
		)
		expect(collections).equals(1)
		expect(responses).equals(0)
		state.count++
		await flat.wait
		expect(collections).equals(1)
		expect(responses).equals(1)
	},

	async "circular loops are forbidden"() {
		const flat = new Flatstate()
		const state = flat.state({count: 0})
		await expect(async() => {
			flat.reaction(
				() => {
					state.count = 123
					return {count: state.count}
				},
				() => {},
			)
			await flat.wait
		}).throws()
		await expect(async() => {
			flat.reaction(
				() => ({count: state.count}),
				() => state.count = 123,
			)
			await flat.wait
		}).throws()
		await expect(async() => {
			flat.reaction(() => state.count = 123)
			await flat.wait
		}).throws()
	},

	async "stop a reaction"() {
		const flat = new Flatstate()
		const state = flat.state({count: 0})
		let calls = 0
		const stop = flat.reaction(() => {
			void state.count
			calls += 1
		})
		state.count += 1
		await flat.wait
		expect(calls).equals(2)
		stop()
		state.count += 1
		await flat.wait
		expect(calls).equals(2)
	},

	async "debounce multiple changes"() {
		const flat = new Flatstate()
		const state = flat.state({count: 0})
		let calls = 0
		flat.reaction(() => {
			void state.count
			calls += 1
		})
		state.count += 1
		state.count += 1
		await flat.wait
		expect(calls).equals(2)
	},

	async "reactions are isolated"() {
		const flatA = new Flatstate()
		const stateA1 = flatA.state({count: 0})
		const stateA2 = flatA.state({count: 0})

		const flatB = new Flatstate()
		const stateB1 = flatB.state({count: 0})
		const stateB2 = flatB.state({count: 0})

		const reactions = {
			stateA1: 0,
			stateA2: 0,
			stateB1: 0,
			stateB2: 0,
		}

		flatA.reaction(() => { void stateA1.count; reactions.stateA1++ })
		flatA.reaction(() => { void stateA2.count; reactions.stateA2++ })

		flatB.reaction(() => { void stateB1.count; reactions.stateB1++ })
		flatB.reaction(() => { void stateB2.count; reactions.stateB2++ })

		stateA1.count++
		await Promise.all([flatA.wait, flatB.wait])
		expect(reactions.stateA1).equals(2)
		expect(reactions.stateA2).equals(1)
		expect(reactions.stateB1).equals(1)
		expect(reactions.stateB2).equals(1)

		stateB1.count++
		await Promise.all([flatA.wait, flatB.wait])
		expect(reactions.stateA1).equals(2)
		expect(reactions.stateA2).equals(1)
		expect(reactions.stateB1).equals(2)
		expect(reactions.stateB2).equals(1)
	},

	async "readonly works with reactions"() {
		const flat = new Flatstate()
		const state = flat.state({count: 0})
		const rstate = Flatstate.readonly(state)
		let calls = 0
		flat.reaction(() => {
			void rstate.count
			calls++
		})
		expect(calls).equals(1)
		state.count++
		await flat.wait
		expect(calls).equals(2)
	},

	async "readonly throws errors on writes"() {
		const flat = new Flatstate()
		const state = flat.state({count: 0})
		const rstate = Flatstate.readonly(state)
		expect(() => { state.count++ }).not.throws()
		expect(() => { rstate.count++ }).throws()
	},

	async "clear all reactions"() {
		const flat = new Flatstate()
		const state = flat.state({count: 0})
		let calls = 0
		flat.reaction(() => { void state.count; calls++ })
		state.count++
		await flat.wait
		expect(calls).equals(2)
		flat.clear()
		state.count++
		await flat.wait
		expect(calls).equals(2)
	},

	async "nested states"() {
		const flat = new Flatstate()
		const outer = flat.state({
			count: 0,
			inner: flat.state({count: 0})
		})
		let outer_calls = 0
		let inner_calls = 0
		flat.reaction(() => {
			void outer.count
			outer_calls++
		})
		flat.reaction(() => {
			void outer.inner.count
			inner_calls++
		})
		expect(outer_calls).equals(1)
		expect(inner_calls).equals(1)

		outer.count++
		await flat.wait
		expect(outer_calls).equals(2)
		expect(inner_calls).equals(1)

		outer.inner.count++
		await flat.wait
		expect(outer_calls).equals(2)
		expect(inner_calls).equals(2)
	},

	async "discovery of new nested states"() {
		const flat = new Flatstate()
		const outer = flat.state({
			inner: undefined as (undefined | {count: number})
		})
		let last_count: undefined | number
		flat.reaction2(() => {
			last_count = outer.inner?.count
		})
		expect(last_count).equals(undefined)
		outer.inner = flat.state({count: 0})
		await flat.wait
		expect(last_count).equals(0)
		outer.inner.count++
		await flat.wait
		expect(last_count).equals(1)
	},
}

