// import http from '../http-common'

class PlantService {
  public getAll () {
    return [
      { name: 'Alameda' },
      { name: 'Calabazas' },
      { name: 'Murrieta' }
    ]
    // return http.get('/plants')
  }

  // public create (data: any) {
  //   return http.post('/plants')
  // }
}

export default new PlantService()
