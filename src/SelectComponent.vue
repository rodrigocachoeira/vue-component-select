<template>
  <div>
    <select>
      <option v-if="ePlaceholder !== undefined" >{{ ePlaceholder }}</option>
      <option v-for="item in items" :value="item[eValue]" >{{ item[eText] }}</option>
    </select>
  </div>
</template>

<script>
  export default {

    name: 'select-component',

    mounted () {
      this.search();
    },

    props: [
      'path', // Caminho onde os dados serão buscados
      'requestType', // Tipo de requisição que deverá ser efetuada
      'eValue', // Nome do atributo que será apresentando no value
      'eText', // Nome do atributo que será apresentando para renderização
      'ePlaceholder', // Opção default do componente select
    ],

    data () {
      return {        
        items: [] // Itens que serão listados no select,        
      }
    },

    methods: {

      /**
      * Realiza uma consulta com o path
      * passado para o componente em busca
      * dos dados que devem ser renderizados no
      * component
      *
      * @author Rodrigo Cachoeira
      * @return void
      */
      search () {
        if (this.path.endsWith('.json')) {
          this.loadJsonFile();
        } else {
          this.loadRequestData();
        }
      },

      /**
      * Carrega as informações provenientes
      * de uma requisição realizada no caminho 
      * informado pela propriedade PATH, informações 
      * estas que serão apresentadas no componente select
      *
      * @author Rodrigo Cachoeira
      * @return void
      */
      loadRequestData () {
        if (this.requestType === undefined) { // Atributo não informado
          this.loadGetRequestData();
        } else {
          this.loadPostRequestData();
        }
      },

      /**
      * Realiza uma requisição GET
      * em busca das informações de uma url
      * para iteração no componente select
      *
      * @author Rodrigo Cachoeira
      * @return void
      */
      loadGetRequestData () {
        this.$http.get(this.path).then(response => {
          this.items = response.data;
        }, reponse => {
          console.log('Request Failed in ' + this.path, response);
        });
      },

      /**
      * Realiza uma requisição POST
      * em busca das informações de uma url
      * para iteração no componente select
      *
      * @author Rodrigo Cachoeira
      * @return void
      */
      loadPostRequestData () {
        this.$http.post(this.path).then(response => {
          this.items = response.data;
        }, reponse => {
          console.log('Request Failed in ' + this.path, response);
        });
      },

      /**
      * Carrega as informações provenientes
      * do arquivo JSON no atributo items, este
      * que será iterado para geração dos items no componente
      * select
      *
      * @author Rodrigo Cachoeira
      * @return void
      */
      loadJsonFile () {
        this.$http.get(this.path).then(response => {
          return response.json(); //converte para JSON
        }, response => {
          console.log('Request Failed in ' + this.path, response);
        }).then(json => { //recebe as informações
          this.items = json;
        });
      }

    }

  }
</script>

<style lang="scss">
</style>
