class Boy {
  @speak('中文')
  run () {
    console.log('I can speak ' + this.language)
    console.log('I can run!')
  }
}

function speak (language) {
  return function (target, key, descriptor) {
    console.log(target)  //Boy
    console.log(key)     //装饰器修饰的方法run
    console.log(descriptor) //writeable,configurable,enumrable

    target.language = language

    return descriptor
  }
}

const luke = new Boy()

luke.run()