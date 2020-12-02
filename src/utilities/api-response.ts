import { Response } from 'express'

interface IApiResponse {
  success(res: Response, data: object | string): Response
  error(res: Response, error: object | string): Response
} 

const ApiResponse: IApiResponse = {
  success: (res: Response, data: object | string): Response => {
    return res.status(200).json({
      status: 'success',
      code: res.statusCode,
      data
    })
  },
  error: (res: Response, error: object | string): Response => {
    return res.status(400).json({
      status: 'error',
      code: res.statusCode,
      error
    })
  }
}

export default ApiResponse
