import Dados from './data.json';

class RecintosZoo {
    #recintosViaveis = [];
    #animais = Dados.animais;
    #recintos = Dados.recintos;

    analisaRecintos(animal, quantidade) {
        if (!(animal in this.#animais.carnivoros) && !(animal in this.#animais.outros)) {
            return { erro: "Animal inválido", recintosViaveis: null };
        }

        if (quantidade <= 0) {
            return { erro: "Quantidade inválida", recintosViaveis: null };
        }

        for (let id in this.#recintos) {
            let animalEscolhido = this.#animais[animal];
            let quantidadeAnimal = quantidade * animalEscolhido.tamanho;
            let espacoLivre = this.#recintos[id].total - this.#recintos[id].existente - quantidadeAnimal;
            if (espacoLivre < 0) {
                continue;
            }

            // Função que verifica se o animal precisa de companhia.
            if (animalEscolhido.necessidade == "COMPANHIA" && quantidade <= 1 && this.#recintos[id].existente == 0) {
                continue;
            }
            //Função que verifica compatibilidade do animal com o bioma do recinto.
            if(!(animalEscolhido.bioma.some(bioma => this.#recintos[id].bioma.includes(bioma)))){
                continue;
            }

            if (animal in this.#animais.carnivoros) {
                if(this.recintoCarnivoro(id) || this.#recintos[id].especie == "VAZIO"){
                    this.#recintosViaveis.push(`Recinto ${id} (espaço livre: ${espacoLivre} total: ${this.#recintos[id].total})`);
                }
            } else {
                if(this.recintoCarnivoro(id)){
                    continue;
                }
                if (animal != this.#recintos[id].especie) {
                    quantidadeAnimal++;
                }
                if (animalEscolhido.necessidade == "BIOMA") {
                    if (animalEscolhido.bioma.every(bioma => this.#recintos[id].bioma.includes(bioma)) || (this.#recintos[id].especie == "VAZIO")) {
                        this.#recintosViaveis.push(`Recinto ${id} (espaço livre: ${espacoLivre} total: ${this.#recintos[id].total})`);
                    }
                    continue;
                }
                this.#recintosViaveis.push(`Recinto ${id} (espaço livre: ${espacoLivre} total: ${this.#recintos[id].total})`);
            }
        }

        if (this.#recintosViaveis.length == 0) {
            return { erro: "Não há recinto viável", recintosViaveis: null };
        }

        return { recintosViaveis: this.#recintosViaveis };
    }

    ///Verificar se é carnivoro ou vazio
    recintoCarnivoro(id){
        if(this.#recintos[id].especie in this.#animais.carnivoros){
            return true;
        } 
        return false;
    }
}

export { RecintosZoo as RecintosZoo };
