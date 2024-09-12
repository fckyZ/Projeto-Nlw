// Importar as funções necessárias do módulo @inquirer/prompts
const { select, input, checkbox } = require('@inquirer/prompts');
const fs = require("fs").promises;

// Variavel de controle
let mensagem = "Bem Vindo ao App";

const carregarMeta = async () => {
    try {
      const dados = await fs.readFile("metas.json", "utf-8");
      metas = JSON.parse(dados);
    }
    catch (erro) {
      metas = [];
    }
}

const salvarMeta = async () => {
  await fs.writeFile("metas.json", JSON.stringify(metas, null, 2));
}

// Criar um array para armazenar as metas
let metas = [];

// Função para cadastrar uma nova meta
const cadastrarMeta = async () => {
  // Solicitar ao usuário que digite a meta
  const meta = await input({ message: 'Digite a Meta:' });

  // Verificar se a meta está vazia
  if (meta.length === 0) {
    mensagem = 'A Meta Não Pode Ser Vazia';
    return; // Encerrar a função se a meta estiver vazia
  }

  // Adicionar a nova meta à lista com o status "não marcada"
  metas.push({ value: meta, checked: false });
  console.log(metas);
};

// Função para listar as metas e permitir que o usuário as marque
const listarMeta = async () => {
  if (metas.length == 0) {
    return
  }

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
    mensagem = 'Nenhuma Meta Selecionada !!!';
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
  if (metas.length == 0) {
    return
  }
  const realizadas = metas.filter((meta) => {
      return meta.checked;
  })
  
  if (realizadas.length == 0) {
    mensagem = "Não Existem Metas Realizadas !";
    return;
  } 

  await select ({
    message: "Metas Realizadas : " + realizadas.length,
    choices: [...realizadas]
  })

}

const metasAbertas = async () => {
  if (metas.length == 0) {
    return
  }
  const abertas = metas.filter((meta) => {
    return !metasRealizadas.checked;
  })

  if (abertas.length == 0) {
  mensagem = "Não Existem Metas Abertas !";
    return;
  }

  await select ({
    message: "Metas Abertas : " + abertas.length,
    choices: [...abertas]
  })


}

const deletarMetas = async () => {
  const metasDesmarcadas = metas.map((meta) => ({ value: meta.value, checked: false }));

  const deletando = await checkbox({
    message: 'Selecione um Item Para Deletar',
    choices: [...metasDesmarcadas],
    instructions: false,
  });

  if (deletando.length === 0) {
    mensagem = "Nenhum Item a Deletar";
    return;
  }

  // Filtrar e atribuir o resultado ao array metas
  metas = metas.filter((meta) => !deletando.includes(meta.value));

  mensagem = "Meta(s) Deletada(s)";
};

const mostrarMensagem = () => {
  console.clear();
}

// Função principal para iniciar a aplicação
const start = async () => {
  await carregarMeta();
  // Loop infinito para manter a aplicação rodando até o usuário sair
  while (true) {
    mostrarMensagem();

    if (mensagem != "" ) {
      console.log(mensagem);
      console.log("");
      mensagem = "";
    }

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
        await salvarMeta();
        break;
      case "listar":
        await listarMeta();
        await salvarMeta();
        break;
      case "realizadas":
        await metasRealizadas();
        break;
      case "abertas":
        await metasAbertas();
        break;
      case "deletar":
        await deletarMetas();
        await salvarMeta();
        break;
      case "sair":
        return; // Sair do loop e encerrar a aplicação
    }
  }
};

// Iniciar a aplicação
start();