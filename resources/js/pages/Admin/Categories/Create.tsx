import React from 'react'

export default function Create() {
  return (
    <div>
      <h1>Tạo danh mục mới</h1>
      <form>
        <div>
          <label htmlFor="name">Tên danh mục</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div>
          <label htmlFor="description">Mô tả</label>
          <textarea id="description" name="description"></textarea>
        </div>
        <button type="submit">Tạo danh mục</button>
      </form>
    </div>
  )
}
