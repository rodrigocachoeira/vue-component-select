<template>
  <div>
    <select @change="trigger" v-model="selected" :disabled="disabled" class="form-control" >
      <option value="" v-if="ePlaceholder !== undefined" >{{ ePlaceholder }}</option>
      <option v-for="item in items" :value="item[eValue]" >{{ item[eText] }}</option>
    </select>
  </div>
</template>

<script>
  import Bus from './utils/events/bus'

  export default {

    name: 'select-component',

    mounted () {
      if (this.requestOnLoad === undefined) {
        this.search();
      } else if (this.requestOnLoad == 'false') {
        this.listener();      
      }    
    },

    computed: {

      /**
      * Verifica se o componente deve ser 
      * desabilitado
      *
      * @author Rodrigo Cachoeira
      * @return boolean
      */
      disabled () {
        return this.receiveCode !== undefined && Object.keys(this.receive).length === 0;
      }

    },

    props: [
      'path', // Caminho onde os dados serão buscados
      'requestType', // Tipo de requisição que deverá ser efetuada
      'eValue', // Nome do atributo que será apresentando no value
      'eText', // Nome do atributo que será apresentando para renderização
      'ePlaceholder', // Opção default do componente select
      'requestOnLoad', // Realiza a requisição ao carregar o componente
      'identifyCode', // Código de identificação do componente
      'receiveCode', // Código de recebimento para ativação de um event de consulta
    ],

    data () {
      return {        
        PACKAGE: 'orion@select-component-', // Identificador de envio de mensagem entre componentes
        items: [], // Itens que serão listados no select,     
        selected: '', // Valor(es) selecioandos
        receive: {} // Valor recebido de outro componente
      }
    },

    methods: {

      /**
      * Verifica se uma mensagem foi recebida
      * para realizar sua consulta
      *
      * @author Rodrigo Cachoeira
      * @return void
      */
      listener () {
        if (this.receiveCode === undefined)
          return; 

        Bus.$on(this.PACKAGE + this.receiveCode, obj => {
          if (obj.reset === undefined) { //verica se o componente deve ser resetado
            this.receive = obj;
            this.search();
          } else {
            this.reset();
          }          
        });
      },

      /**
      * Resta o componente
      *
      * @author Rodrigo Cachoeira
      * @return void
      */
      reset () {
        this.receive = {};
        this.selected = '';
        this.items = [];
      },

      /**
      * Dispara uma mensagem quando o 
      * componente select é alterado, 
      * ação está que é utilizada para caso
      * algum outro componente dependa deste
      * compoente
      *
      * @author Rodrigo Cachoeira
      * @return void
      */
      trigger () {
        if (this.identifyCode === undefined)
          return;        

        if (this.selected === '') {
          Bus.$emit(this.PACKAGE + this.identifyCode, {reset: true}); // resetar componente filho
        } else {
          Bus.$emit(this.PACKAGE + this.identifyCode, this.getSelected());
        }        
      },

      /**
      * Retorna o objeto selecionado
      * buscando na lista de registro o seu
      * identificador
      *
      * @author Rodrigo Cachoeira
      * @return Object
      */
      getSelected () {
        var items = this.items.filter(item => {
          return item[this.eValue] === this.selected;
        });
        if (items.length > 0) {
          return items[0];
        }
        return {};
      },

      /**
      * Retorna o objeto recebido 
      * de outro componente, caso
      * este exista
      *
      * @return Object
      */
      getReceive () {
        if (this.requestOnLoad == 'false' && this.receive !== undefined) {
          return this.receive;
        }
        return {};
      },

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
        this.$http.post(this.path, this.getReceive()).then(response => {
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
