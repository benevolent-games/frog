
import {Flat} from "./flat.js"
import {Suite, expect} from "cynic"

export default <Suite>{

	async "we can increment a count"() {
		const flat = new Flat()
		const state = flat.state({count: 0})
		expect(state.count).equals(0)

		state.count += 1
		expect(state.count).equals(1)
	},

	reaction: {

		async "we can react to a changed property"() {
			const flat = new Flat()
			const state = flat.state({count: 0})
			let responder_calls = 0
			flat.reaction(
				() => ({count: state.count}),
				() => { responder_calls += 1 },
			)
			expect(responder_calls).equals(0)
			expect(state.count).equals(0)
			state.count = 123
			expect(state.count).equals(123)
			expect(responder_calls).equals(1)
		},

		async "reaction with only one function"() {
			const flat = new Flat()
			const state = flat.state({count: 0})
			let responder_calls = 0
			flat.reaction(() => {
				void state.count
				responder_calls += 1
			})
			expect(responder_calls).equals(1)
			expect(state.count).equals(0)
			state.count = 123
			expect(state.count).equals(123)
			expect(responder_calls).equals(2)
		},

		async "circular loops are forbidden"() {
			const flat = new Flat()
			const state = flat.state({count: 0})
			expect(() => {
				flat.reaction(
					() => {
						state.count = 123
						return {count: state.count}
					},
					() => {},
				)
			}).throws()
		},

		async "cleanup a reaction"() {
			const flat = new Flat()
			const state = flat.state({count: 0})
			let calls = 0
			const stop = flat.reaction(() => {
				void state.count
				calls += 1
			})
			state.count += 1
			expect(calls).equals(2)
			stop()
			state.count += 1
			expect(calls).equals(2)
		},

		// async "debounce multiple changes"() {
		// 	const flat = new Flat()
		// 	const state = flat.state({count: 0})
		// 	let calls = 0
		// 	flat.reaction(() => {
		// 		void state.count
		// 		calls += 1
		// 	})
		// 	state.count += 1
		// 	state.count += 1
		// 	expect(calls).equals(2)
		// },

	},
}

