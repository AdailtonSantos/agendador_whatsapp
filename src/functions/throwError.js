function throwError(response, context){
    if (response.data.error) {
      console.log(response.data.error)
      return alert("Ocorreu um erro");
    }
    if (response.data.tokenError) {
      console.log(response.data.tokenError)
      return context.$router.push("/");
    }
  }

module.exports =  throwError