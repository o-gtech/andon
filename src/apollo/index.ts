import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

Vue.use(VueApollo)

const httpLink = createHttpLink({
  uri: `${process.env.VUE_APP_API_ENDPOINT}graphql`
})

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  link: httpLink,
  cache
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  errorHandler (error) {
    // eslint-disable-next-line no-console
    console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message)
  }
})

export default apolloProvider
