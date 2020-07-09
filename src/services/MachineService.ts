// import http from '../http-common'

class MachineService {
  public getAll (plantID: string) {
    switch (plantID) {
      case 'Calabazas':
        return [
          { name: '10' },
          { name: '11' },
          { name: '12' }
        ]
      default:
        return [
          { name: '90' },
          { name: '91' },
          { name: '92' }
        ]
    }
    // return http.get('/machines/${plantID}')
  }

  // public create (data: any) {
  //   return http.post('/machines')
  // }
}

export default new MachineService()
