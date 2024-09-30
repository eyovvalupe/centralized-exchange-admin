export default {
  inserted( el, binding ) {
    console.log( el )
    el.removeEventListener( 'click', () => {} )
    el.addEventListener(
      'click',
      () => {
        // TODO: 校验权限
        // console.log( 1111 )
      },
      true
    ) // 阻止冒泡
  }
}

