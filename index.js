const {select, input, checkbox} = require(`@inquirer/prompts`)
let metas = []

const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a Meta: "})

    if (meta.length == 0) {
        console.log("A Meta Não Pode Ser Vazia")
        return
    }

    metas.push({value: meta, checked: false})
}

const listarMeta = async () => {
    const resposta = await checkbox ({
        message: "Use as Setas Para Mudar de Meta, o Espaço Para Marcar e Descarcar e o Enter Para Finalizar Essa Etapa",
        choices: [...metas],
        instructions: false,                 
    })

    if (resposta.length == 0) {
        console.log("Nenhuma Meta Selecionada !!!")
        return
    }

    metas.forEach((m) => {
        m.checked = false
    })

    resposta.forEach((r) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

}

const start = async () => {


    while (true) {
        const opc = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar Meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar Metas",
                    value: "listar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]

        })

        switch (opc) {
            case "cadastrar":
                await cadastrarMeta()
                console.log(metas)
                break
            case "listar":
                await listarMeta()
                break
            case "sair":
                return
        }
    }
}

start()

