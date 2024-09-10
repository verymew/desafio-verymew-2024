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

        // Sessão que verifica animais carnívoros.
        if (animal in this.#animais.carnivoros) {
            let animalEscolhidoCarnivoro = this.#animais.carnivoros[animal];
            for (let id in this.#recintos) {
                // Função que verifica a compatibilidade de biomas entre o animal e o recinto.
                if (animalEscolhidoCarnivoro.bioma.some(bioma => this.#recintos[id].bioma.includes(bioma))) {
                    // Função que verifica se é da mesma espécie. Carnívoros só podem ficar com os da mesma espécie.
                    if (animal == this.#recintos[id].especie || this.#recintos[id].especie == "VAZIO") {
                        let quantidadeAnimal = quantidade * animalEscolhidoCarnivoro.tamanho;
                        let espacoLivre = this.#recintos[id].total - this.#recintos[id].existente - quantidadeAnimal;   
                        if (espacoLivre >= 0) {
                            this.#recintosViaveis.push(`Recinto ${id} (espaço livre: ${espacoLivre} total: ${this.#recintos[id].total})`);
                        }
                    }
                }
            }
        }

        // Sessão que verifica animais que não são carnívoros.
        if (animal in this.#animais.outros) {
            let animalEscolhidoOutro = this.#animais.outros[animal];
            for (let id in this.#recintos) {
                // Função que verifica a compatibilidade de biomas entre o animal e o recinto.
                if (animalEscolhidoOutro.bioma.some(bioma => this.#recintos[id].bioma.includes(bioma)) && !(this.#recintos[id].especie in this.#animais.carnivoros)) {
                    let quantidadeAnimal = quantidade * animalEscolhidoOutro.tamanho;
                    if (animal != this.#recintos[id].especie && this.#recintos[id].especie != "VAZIO") {
                        quantidadeAnimal++;
                    }
                    let espacoLivre = this.#recintos[id].total - this.#recintos[id].existente - quantidadeAnimal;
                    if (espacoLivre <= 0) {
                        continue;
                    }

                    // Função específica para o hipopótamo.
                    if (animalEscolhidoOutro.necessidade == "BIOMA") {
                        if (animalEscolhidoOutro.bioma.every(bioma => this.#recintos[id].bioma.includes(bioma)) || (this.#recintos[id].especie == "VAZIO")) {
                            this.#recintosViaveis.push(`Recinto ${id} (espaço livre: ${espacoLivre} total: ${this.#recintos[id].total})`);
                        }
                        continue;
                    }
                    // Função que verifica se o animal precisa de companhia.
                    if (animalEscolhidoOutro.necessidade == "COMPANHIA" && quantidade <= 1 && this.#recintos[id].existente == 0) {
                        continue;
                    }

                    this.#recintosViaveis.push(`Recinto ${id} (espaço livre: ${espacoLivre} total: ${this.#recintos[id].total})`);
                }
            }
        }

        if (this.#recintosViaveis.length == 0) {
            return { erro: "Não há recinto viável", recintosViaveis: null };
        }

        return { recintosViaveis: this.#recintosViaveis };
    }
}

export { RecintosZoo as RecintosZoo };
