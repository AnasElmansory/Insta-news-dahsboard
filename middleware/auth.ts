export default function ({ store, router }: { store: any; router: any }) {
  console.log(router)
  console.log(store)
  // If the user is not authenticated
  if (!store.state.authenticated) {
    return router('/sign')
  }
}
