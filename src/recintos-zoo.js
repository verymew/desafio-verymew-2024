import Dados from './data.json';

class RecintosZoo {
    #recintosViaveis = [];

    analisaRecintos(animal, quantidade) {
        let animais = Dados.animais;
        let recintos = Dados.recintos;

        if (!(animal in animais.carnivoros) && !(animal in animais.outros)) {
            return { erro: "Animal inválido", recintosViaveis: null };
        }

        if (quantidade <= 0) {
            return { erro: "Quantidade inválida", recintosViaveis: null };
        }

        //Sessão que verifica animais carnívoros.
        if (animal in animais.carnivoros) {
            let animalEscolhidoCarnivoro = animais.carnivoros[animal];
            for (let id in recintos) {
                //Função que verifica a compatibilidade de biomas entre o animal e o recinto.
                if (animalEscolhidoCarnivoro.bioma.some(bioma => recintos[id].bioma.includes(bioma))) {
                    //Função que verifica se é da mesma espécie. Carnívoros só podem ficar com os da mesma espécie.
                    if (animal == recintos[id].especie || recintos[id].especie == "VAZIO") {
                        let quantidadeAnimal = quantidade * animalEscolhidoCarnivoro.tamanho;
                        let espacoLivre = recintos[id].total - recintos[id].existente - quantidadeAnimal;   
                        if (espacoLivre >= 0) {
                            this.#recintosViaveis.push(`Recinto ${id} (espaço livre: ${espacoLivre} total: ${recintos[id].total})`);
                        };
                    };
                };
            };
        };

        //Sessão que verifica animais que não são carnívoros.
        if (animal in animais.outros) {
            let animalEscolhidoOutro = animais.outros[animal];
            for (let id in recintos) {
                //Função que verifica a compatibilidade de biomas entre o animal e o recinto.
                if (animalEscolhidoOutro.bioma.some(bioma => recintos[id].bioma.includes(bioma)) && !(recintos[id].especie in animais.carnivoros)) {
                    let quantidadeAnimal = quantidade * animalEscolhidoOutro.tamanho;
                    if (animal != recintos[id].especie && recintos[id].especie != "VAZIO") {
                        quantidadeAnimal++;
                    };
                    let espacoLivre = recintos[id].total - recintos[id].existente - quantidadeAnimal;
                    if (espacoLivre <= 0) {
                        continue;
                    };

                    //Função específica para o hipopotamo.
                    if (animalEscolhidoOutro.necessidade == "BIOMA") {
                        if (animalEscolhidoOutro.bioma.every(bioma => recintos[id].bioma.includes(bioma)) || (recintos[id].especie == "VAZIO")) {
                            this.#recintosViaveis.push(`Recinto ${id} (espaço livre: ${espacoLivre} total: ${recintos[id].total})`);
                        };
                        continue;
                    };
                    //Função que verifica se o animal precisa de companhia.
                    if (animalEscolhidoOutro.necessidade == "COMPANHIA"
                        && quantidade <= 1
                        && recintos[id].existente == 0
                    ) {
                        continue;
                    };

                    this.#recintosViaveis.push(`Recinto ${id} (espaço livre: ${espacoLivre} total: ${recintos[id].total})`)
                };
            };
        };

        if (this.#recintosViaveis.length == 0) {
            return { erro: "Não há recinto viável", recintosViaveis: null };
        }

        return { recintosViaveis: this.#recintosViaveis };
    }
}

export { RecintosZoo as RecintosZoo };
