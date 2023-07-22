
import {css} from "lit"

export const common_styles = css`

	:host {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 0.5em;
		border-radius: 0.5em;
		background: #52ffc122;
	}

	:host > * {
		margin: 0.5em;
	}

	:host > :nth-child(1) {
		margin-right: auto;
	}

	.tag {
		font-weight: bold;
	}

	.count {
		font-family: monospace;
	}

`

