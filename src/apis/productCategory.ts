import request from '@/utils/http'

/**
 * @description 获取工具分类列表
 */
export const getProductCategoryList = (data: any): Promise<any> => {
  return request<{ token: string }>({
    url: '/admin/productCategory/getProductCategoryList',
    method: 'POST',
    data
  })
}

/**
 * @description 更新工具分类
 */
export const updateProductCategory = (data: any): Promise<any> => {
  return request<{ token: string }>({
    url: '/admin/productCategory/update',
    method: 'POST',
    data
  })
}

/**
 * @description 创建工具分类
 */
export const createProductCategory = (data: any): Promise<any> => {
  return request<{ token: string }>({
    url: '/admin/productCategory/create',
    method: 'POST',
    data
  })
}
