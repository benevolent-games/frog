
import {easypage, html, startup_scripts_with_dev_mode, template} from "@benev/turtle"

export default template(async basics => {
	const path = basics.path(import.meta.url)
	return easypage({
		path: basics.path(import.meta.url),
		title: "@benev/frog",
		head: html`
			<link rel="stylesheet" href="${path.version.root('index.css')}"/>
			<link rel="icon" href="${path.root('assets/frog-favicon.webp')}"/>
			${startup_scripts_with_dev_mode(path)}
		`,
		body: html`
			<div class=zone>
				<img alt="" src="${path.root('assets/frog-cutout.webp')}"/>
				<div class=plate>
					<h1><span>@benev/</span><span>frog</span></h1>
					<p><a href="https://github.com/benevolent-games/frog">https://github.com/benevolent-games/frog</a></p>
					<local-counter></local-counter>
					<app-counter-display></app-counter-display>
					<app-counter-button></app-counter-button>
					<flat-counter></flat-counter>
				</div>
			</div>
		`,
	})
})

