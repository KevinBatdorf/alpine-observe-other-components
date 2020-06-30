const AlpineObserver = require('../index')

test('Event listener attribute is added to all elements with x-alpine-observe', () => {
	document.body.innerHTML = `<div id="x-on-applied" x-data="{}" x-alpine-observe="go"></div>`
	AlpineObserver()
	expect(document.querySelector('#x-on-applied')
		.getAttribute('x-on:alpine-observer-mutation.window'))
		.toEqual("if ($event.detail.id == $el.getAttribute('x-alpine-observer-id')) go($event.detail)")
})

test('x-alpine-observe can accept a function of an object', () => {
	document.body.innerHTML = `<div class="observerDataFunction" x-data="{}" x-alpine-observe="go"></div>`
	document.body.innerHTML = `<div class="observerDataFunction" x-data="{}" x-alpine-observe="go()"></div>`
	document.body.innerHTML = `<div class="observerDataFunction" x-data="{}" x-alpine-observe="{callback: 'go'}"></div>`
	AlpineObserver()
	document.querySelectorAll('.observerDataFunction').forEach(component => {
		expect(component.getAttribute('x-on:alpine-observer-mutation.window'))
		.toEqual("if ($event.detail.id == $el.getAttribute('x-alpine-observer-id')) go($event.detail)")
	})
})

// TODO: