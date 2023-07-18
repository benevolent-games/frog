
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
	}

}

