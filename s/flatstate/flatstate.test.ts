
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

}

