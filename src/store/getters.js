const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  staffPhoto: state => state.user.userInfo.staffPhoto,
  token: state => state.user.token,
  name: state => state.user.userInfo.username
}
export default getters
