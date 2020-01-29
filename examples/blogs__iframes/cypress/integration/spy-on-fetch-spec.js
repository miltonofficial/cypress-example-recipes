/// <reference types="cypress" />
/* eslint-disable mocha/no-global-tests */

// yields iframe's document
const getIframeDocument = () => {
  return cy
  .get('iframe[src="https://jsonplaceholder.typicode.com/"]')
  .its('0.contentDocument').should('exist')
}

const getIframeBody = () => {
  return getIframeDocument().its('body').should('not.be.undefined').then(cy.wrap)
}

const getIframeWindow = () => {
  return cy
  .get('iframe[src="https://jsonplaceholder.typicode.com/"]')
  .its('0.contentWindow').should('exist')
}

it('spies on window.fetch method call', () => {
  cy.visit('index.html')

  getIframeWindow().then((win) => {
    cy.spy(win, 'fetch').as('fetch')
  })

  getIframeBody().find('#run-button').should('have.text', 'Try it').click()
  getIframeBody().find('#result').should('include.text', '"delectus aut autem"')

  // because the UI has already updated, we know the fetch has happened
  // so we can use "cy.get" to retrieve it without waiting
  // otherwise we would have used "cy.wait('@fetch')"
  cy.get('@fetch').should('have.been.calledOnce')
  // let's confirm the url argument
  .and('have.been.calledWith', 'https://jsonplaceholder.typicode.com/todos/1')
})
