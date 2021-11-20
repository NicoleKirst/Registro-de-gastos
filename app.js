class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for(let i in this) {
            if(this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}

class Bd {

    constructor() {
        let id = localStorage.getItem('id')

        if (id === null){
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id') //getItem recupera o dado dentro de localStore
        return parseInt(proximoId) + 1 //transforma de JSON para objeto
    }

    gravar(d) {

        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d)) //setItem insere o dado em localStore
        localStorage.setItem('id', id)
    }
    recuperarTodosRegistros() {

        // array despesas
        let despesas = Array()

        let id = localStorage.getItem('id')

        //recupera todas as despesas cadastradas em localStorage
        for(let i = 1; i <= id; i++) {

            //recuperar a despesa
            let despesa = JSON.parse(localStorage.getItem(i))

            //verificar se existe a possibilidade de haver índices que foram pulados ou removidos
            //nesse caso vamos pular esses itens
            if (despesa === null){
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }

    //cria filtro de despesas em consulta
    pesquisar(despesa) {
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()
        console.log(despesasFiltradas)
		console.log(despesa)

        //ano
        if(despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        //mês
        if(despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        //dia
        if(despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //tipo
        if(despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        //descrição
        if(despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        //valor
        if(despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        return despesasFiltradas
    }
    remover(id) {
        localStorage.removeItem(id)
    }
}
let bd = new Bd() 



function cadastrarDespesa() {  

    let ano = document.querySelector('#ano') 
    let mes = document.querySelector('#mes')
    let dia = document.querySelector('#dia')
    let tipo = document.querySelector('#tipo')
    let descricao = document.querySelector('#descricao')
    let valor = document.querySelector('#valor')

    //puxa do construtor
    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value,
    )
    

    if (despesa.validarDados()) {
        bd.gravar(despesa)

        document.querySelector('#modal_titulo').innerHTML = 'Registro inserido com sucesso!'
        document.querySelector('#modal_titulo_div').className = 'modal-header text-success'
        document.querySelector('#modal_conteudo').innerHTML = 'Despesa cadastrada com sucesso'
        document.querySelector('#modal_btn').innerHTML = 'Voltar'
        document.querySelector('#modal_btn').className = 'btn btn-success'
        
        //dialog de sucesso
        $('#modalRegistraDespesa').modal('show')
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
 
    } else {
       
        document.querySelector('#modal_titulo').innerHTML = 'Erro na inclusão do registro!'
        document.querySelector('#modal_titulo_div').className = 'modal-header text-danger'
        document.querySelector('#modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente'
        document.querySelector('#modal_btn').innerHTML = 'Voltar e corrigir'
        document.querySelector('#modal_btn').className = 'btn btn-danger'

        //dialog de erro
       $('#modalRegistraDespesa').modal('show')
    }
    
}

function carregaListaDespesas(despesas = Array(), filtro = false) {
   
   
    if(despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }

    //selecionando elementos tbody da tabela
    let listaDespesas = document.querySelector('#listaDespesas')
    listaDespesas.innerHTML = ''


    //percorrer o array despesas, listando despesas de forma dinâmica
    despesas.forEach(function(d){
        //criando tabela 
        //insere (tr)
        let linha = listaDespesas.insertRow() 

        //criar as colunas (td)
        linha.insertCell(0).innerHTML =`${d.dia}/${ d.mes}/${d.ano}` 

        //ajustar tipo, ao invés de número -> descrição
        switch(d.tipo) {
            case '1':d.tipo = 'Alimentação'
                break
            case '2':d.tipo = 'Educação'
                break
            case '3':d.tipo = 'Lazer'
                break
            case '4':d.tipo = 'Saúde'
                break
            case '5':d.tipo = 'Transporte'
                break
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //criar o botão de exclusão
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function() {
            //remover a despesa
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)
        console.log(d)
    })
}

function pesquisarDespesa() {

    let ano = document.querySelector('#ano').value 
    let mes = document.querySelector('#mes').value 
    let dia = document.querySelector('#dia').value 
    let tipo = document.querySelector('#tipo').value 
    let descricao = document.querySelector('#descricao').value 
    let valor = document.querySelector('#valor').value 

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
    
    let despesas = bd.pesquisar(despesa)

    this.carregaListaDespesas(despesas, true)
}









