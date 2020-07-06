import http from '../http-common'

class MessageService {
  public send (data: any) {
    return http.post('/sendText', data)
  }
}

export default new MessageService()
