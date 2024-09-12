// Importar as funções necessárias do módulo @inquirer/prompts
const { select, input, checkbox } = require('@inquirer/prompts');

// Criar um array para armazenar as metas
let metas = [];

// Função para cadastrar uma nova meta
const cadastrarMeta = async () => {
  // Solicitar ao usuário que digite a meta
  const meta = await input({ message: 'Digite a Meta:' });

  // Verificar se a meta está vazia
  if (meta.length === 0) {
    console.log('A Meta Não Pode Ser Vazia');
    return; // Encerrar a função se a meta estiver vazia
  }

  // Adicionar a nova meta à lista com o status "não marcada"
  metas.push({ value: meta, checked: false });
  console.log(metas);
};

// Função para listar as metas e permitir que o usuário as marque
const listarMeta = async () => {
  // Exibir as metas para o usuário marcar
  const resposta = await checkbox({
    message: 'Use as Setas Para Mudar de Meta, o Espaço Para Marcar e Descarcar e o Enter Para Finalizar Essa Etapa',
    choices: [...metas], // Criar uma cópia das metas para evitar modificações indesejadas
    instructions: false,
  });

  // Resetar o status de todas as metas para "não marcada"
  metas.forEach((m) => {
    m.checked = false;
  });

  // Verificar se nenhuma meta foi selecionada
  if (resposta.length === 0) {
    console.log('Nenhuma Meta Selecionada !!!');
    return;
  }

  // Atualizar o status das metas selecionadas para "marcada"
  resposta.forEach((r) => {
    const meta = metas.find((m) => {
      return m.value === r;
    });

    meta.checked = true;
  });
};

// Função para as metas realizadas
const metasRealizadas = async () => {
  const realizadas = metas.filter((meta) => {
      return meta.checked;
  })
  
  if (realizadas.length == 0) {
    console.log("Não Existem Metas Realizadas !");
    return;
  } 

  await select ({
    message: "Metas Realizadas : " + realizadas.length,
    choices: [...realizadas]
  })

}

const metasAbertas = async () => {
  const abertas = metas.filter((meta) => {
    return !metasRealizadas.checked;
  })

  if (abertas.length == 0) {
    console.log("Não Existem Metas Abertas !");
    return;
  }

  await select ({
    message: "Metas Abertas : " + abertas.length,
    choices: [...abertas]
  })


}

const deletarMetas = async () => {
  const metasDesmarcadas = metas.map((meta) => {
    return {value: meta.value, checked: false}
  })

  const deletando = await checkbox({
    message: 'Selecione um Item Para Selecionar',
    choices: [...metasDesmarcadas], // Criar uma cópia das metas para evitar modificações indesejadas
    instructions: false,
  });

  if (deletando.length == 0) {
    console.log("Nenhum Item a Deletar");
    return
  }

  deletando.forEach((i) => {
    metas.filter((meta) => {
      return meta.value != i;
    })
  })

  console.log("Meta(s) Deletada(s)");
}

// Função principal para iniciar a aplicação
const start = async () => {
  // Loop infinito para manter a aplicação rodando até o usuário sair
  while (true) {
    // Exibir o menu principal
    const opc = await select({
      message: 'Menu >',
      choices: [
        {
          name: 'Cadastrar Meta',
          value: 'cadastrar',
        },
        {
          name: 'Listar Metas',
          value: 'listar',
        },
        {
          name: 'Metas Realizadas',
          value: 'realizadas'
        },
        {
          name: 'Metas Abertas',
          value: 'abertas'
        },
        {
          name: 'Deletar Metas',
          value: 'deletar'
        },
        {
          name: 'Sair',
          value: 'sair',
        },
      ],
    });

    // Executar a ação correspondente à opção escolhida
    switch (opc) {
      case "cadastrar":
        await cadastrarMeta();
        break;
      case "listar":
        await listarMeta();
        break;
      case "realizadas":
        await metasRealizadas();
        break;
      case "abertas":
        await metasAbertas();
        break;
      case "sair":
        return; // Sair do loop e encerrar a aplicação
    }
  }
};

// Iniciar a aplicação
start();