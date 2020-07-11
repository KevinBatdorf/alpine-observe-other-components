function AlpineObserver() {
	const observers = []
	// Find each element interested in observing
	Array.from(document.querySelectorAll('[x-alpine-observe]')).forEach(alpineObserverComponent => {
		const id = Date.now() + Math.floor(Math.random() * 1000000)
		alpineObserverComponent.setAttribute('x-alpine-observer-id', id)

		let functionName = alpineObserverComponent.getAttribute('x-alpine-observe').replace(/[()]/g, '') // Remove ()
		let selector = ''
		if (functionName.indexOf('{') === 0) {
			// convert to JSON in case it's an object
			functionNameObject = JSON.parse(functionName.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g, '"'))
			functionName = functionNameObject['callback']
			selector = functionNameObject['selector']
		}

		// Only watch the events we care about
		alpineObserverComponent.setAttribute(
			'x-on:alpine-observer-mutation.window', 
			`if ($event.detail.id == $el.getAttribute('x-alpine-observer-id')) ${functionName}($event.detail)`
		)
		
		observers[id] = new MutationObserver(mutations => {
			for (let i = 0; i < mutations.length; i++) {
				const closestParentComponent = mutations[i].target.closest('[x-data]')
				if ((closestParentComponent && closestParentComponent.isSameNode(alpineObserverComponent))) continue
				const observed = Array.from(document.querySelectorAll(`[x-data]${selector}`)).filter(a => a.getAttribute('x-alpine-observer-id') != id)
				window.dispatchEvent(new CustomEvent('alpine-observer-mutation', {
					detail: {
						id: id,
						components: observed.map(a => a.__x),
						data: observed.filter(a => a.__x).map(a => a.__x.getUnobservedData()),
						mutation: mutations[i]
					},
					bubbles: true,
				}))
			}
		})

		Array.from(document.querySelectorAll(`[x-data]${selector}`)).forEach(alpineComponent => {
			if (alpineComponent.getAttribute('x-alpine-observer-id') == id) return // Don't watch self
			observers[id].observe(alpineComponent, {
				attributes: true,
				childList: true,
				subtree: true,
			})
		})
	})
}

const alpine = window.deferLoadingAlpine || ((alpine) => alpine())
window.deferLoadingAlpine = function(callback) {
	AlpineObserver()
	alpine(callback)
}

module.exports = AlpineObserver