export default function({ store, redirect, route }) {
  if (store.state.user) {
    return redirect('/')
  }
}
// I use this middleware to avoid entering available routes when
// you are not logged in, for example "/auth/signup"
