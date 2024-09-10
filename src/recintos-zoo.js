    import Dados from './data.json';

    class RecintosZoo {
        #recintosViaveis = [];
        #animais = Dados.animais;
        #recintos = Dados.recintos;

        analisaRecintos(animal, quantidade) {
            this.#recintosViaveis = [];

            if (!(animal in this.#animais.carnivoros) && !(animal in this.#animais.outros)) {
                return { erro: "Animal inválido", recintosViaveis: null };
            }

            if (quantidade <= 0) {
                return { erro: "Quantidade inválida", recintosViaveis: null };
            }

            for (let id in this.#recintos) {
                let animalEscolhido = this.#animais[this.isCarnivoro(animal)][animal];
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
                if (!(animalEscolhido.bioma.some(bioma => this.#recintos[id].bioma.includes(bioma)))) {
                    continue;
                }

                if (animal in this.#animais.carnivoros) {
                    if (this.isRecintoCarnivoro(id) || this.#recintos[id].especie == "VAZIO") {
                        this.#recintosViaveis.push(`Recinto ${id} (espaço livre: ${espacoLivre} total: ${this.#recintos[id].total})`);
                    }
                } else {
                    if (this.isRecintoCarnivoro(id)) {
                        continue;
                    }
                    if (this.#recintos[id].especie !== "VAZIO" && this.#recintos[id].especie !== animal) {
                        espacoLivre--;
                    }
                    //Função que verifica se o recinto está vazio ou se possui todos os biomas necessários.
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
        ///Função que verifica se Recinto é carnivoro
        isRecintoCarnivoro(id) { return this.#recintos[id].especie in this.#animais.carnivoros; }
        //Função verifica se o animal é carnivoro 
        isCarnivoro(animal) { if (animal in this.#animais.carnivoros) { return "carnivoros" } else { return "outros" } }
    }

    export { RecintosZoo as RecintosZoo };
