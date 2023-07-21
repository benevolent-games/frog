
import {Suite, expect} from "cynic"
import {Flatstate} from "./flat3.js"

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
		let calls = false
		flat.reaction(
			() => ({count: state.count}),
			() => { calls = true },
		)
		expect(calls).equals(false)
		expect(state.count).equals(0)
		state.count = 123
		await flat.wait
		expect(state.count).equals(123)
		expect(calls).equals(true)
	},

	async "reaction with only one function"() {
		const flat = new Flatstate()
		const state = flat.state({count: 0})
		let called = false
		flat.reaction(() => {
			void state.count
			called = true
		})
		expect(called).equals(true)
		expect(state.count).equals(0)
		called = false
		state.count = 123
		await flat.wait
		expect(state.count).equals(123)
		expect(called).equals(true)
	},

	async "reaction collector can pass data to responder"() {
		const flat = new Flatstate()
		const state = flat.state({count: 0, greeting: "hello"})
		let a: number = -1
		let b: string = ""
		flat.reaction(
			() => ({count: state.count, greeting: state.greeting}),
			({count, greeting}) => {
				a = count
				b = greeting
			},
		)
		expect(a).equals(-1)
		expect(b).equals("")
		state.count++
		state.greeting = "hello world"
		await flat.wait
		expect(a).equals(1)
		expect(b).equals("hello world")
	},

	async "manual can be efficient"() {
		const flat = new Flatstate()
		const state = flat.state({count: 0})
		let collect = false
		let respond = false
		flat.manual({
			debounce: true,
			discover: false,
			collector: () => {
				void state.count
				collect = true
			},
			responder: () => {
				void state.count
				respond = true
			},
		})
		expect(collect).equals(true)
		expect(respond).equals(false)
		collect = false
		respond = false
		state.count++
		await flat.wait
		expect(collect).equals(false)
		expect(respond).equals(true)
	},

	async "circular loops are forbidden"() {
		const settings = {debounce: true, discover: false}

		await expect(async() => {
			const flat = new Flatstate()
			const state = flat.state({count: 0})
			flat.manual({
				...settings,
				collector: () => {
					state.count = 123
					return {count: state.count}
				},
				responder: () => {},
			})
			await flat.wait
		}).throws()

		await expect(async() => {
			const flat = new Flatstate()
			const state = flat.state({count: 0})
			flat.manual({
				...settings,
				collector: () => ({count: state.count}),
				responder: () => { state.count = 123 },
			})
			state.count++
			await flat.wait
		}).throws()

		await expect(async() => {
			const flat = new Flatstate()
			const state = flat.state({count: 0})
			flat.reaction(() => state.count = 123)
			await flat.wait
		}).throws()
	},

	async "stop a reaction"() {
		const flat = new Flatstate()
		const state = flat.state({count: 0})
		let called = false
		const stop = flat.reaction(() => {
			void state.count
			called = true
		})

		called = false
		state.count++
		await flat.wait
		expect(called).equals(true)

		called = false
		stop()
		state.count++
		await flat.wait
		expect(called).equals(false)
	},

	async "debounce multiple changes"() {
		const flat = new Flatstate()
		const state = flat.state({count: 0})
		let calls = 0
		flat.manual({
			debounce: true,
			discover: false,
			collector: () => void state.count,
			responder: () => calls++,
		})
		state.count++
		state.count++
		state.count++
		await flat.wait
		expect(calls).equals(1)
	},

	async "discovery of new nested states"() {
		const flat = new Flatstate()
		const outer = flat.state({
			inner: undefined as (undefined | {count: number})
		})
		let last_count: undefined | number
		flat.reaction(() => {
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

