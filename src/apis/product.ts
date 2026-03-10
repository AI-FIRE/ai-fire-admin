import request from '@/utils/http'

export const getProductList = (data: any): Promise<any> => {
  return request({
    url: '/admin/product/getProductList',
    method: 'POST',
    data
  })
}

export const getProductDetail = (data: any): Promise<any> => {
  return request({
    url: '/admin/product/getProductDetail',
    method: 'POST',
    data
  })
}

export const createProduct = (data: any): Promise<any> => {
  return request({
    url: '/admin/product/createProduct',
    method: 'POST',
    data
  })
}

export const updateProduct = (data: any): Promise<any> => {
  return request({
    url: '/admin/product/updateProduct',
    method: 'POST',
    data
  })
}

export const deleteProduct = (data: any): Promise<any> => {
  return request({
    url: '/admin/product/deleteProduct',
    method: 'POST',
    data
  })
}
