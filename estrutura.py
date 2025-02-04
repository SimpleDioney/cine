import requests
from bs4 import BeautifulSoup
import urllib.parse
import random
import time

# Lista de alguns user agents (adicione mais se desejar)
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:112.0) Gecko/20100101 Firefox/112.0"
]

def get_random_headers():
    return {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
    }

#############################################
# Parte 1: Sistema de Pesquisa na Amazon
#############################################
def fazer_pesquisa_amazon(titulo):
    """Realiza uma pesquisa na Amazon Brasil pelo título do livro."""
    base_url = "https://www.amazon.com.br/s"
    params = {
        'k': titulo,
        'i': 'stripbooks'
    }
    try:
        response = requests.get(base_url, params=params, headers=get_random_headers(), timeout=15)
        response.raise_for_status()
        # Se houver indicação de CAPTCHA, interrompe a execução.
        if "captcha" in response.text.lower():
            raise Exception("Detecção de bot ativada na Amazon.")
        return response.text
    except Exception as e:
        print(f"Erro na pesquisa Amazon: {str(e)}")
        return None

def extrair_dados_amazon(html):
    """Extrai dados relevantes (título, link, autor, preço e avaliação) do HTML retornado pela Amazon."""
    soup = BeautifulSoup(html, 'html.parser')
    resultados = []
    for item in soup.select('.s-result-item[data-component-type="s-search-result"]'):
        # Ignora itens patrocinados
        if item.find('span', {'class': 's-sponsored-label-text'}):
            continue

        title_elem = item.select_one("h2.a-size-medium")
        link_elem = item.select_one("h2 a")
        titulo_text = title_elem.get_text(strip=True) if title_elem else "N/A"
        link_text = "https://www.amazon.com.br" + link_elem['href'] if link_elem and link_elem.has_attr('href') else "#"

        preco_elem = item.select_one(".a-price .a-offscreen")
        preco_text = preco_elem.get_text(strip=True) if preco_elem else "N/A"

        avaliacao_elem = item.select_one(".a-icon-alt")
        avaliacao_text = avaliacao_elem.get_text(strip=True).split()[0] if avaliacao_elem else "N/A"

        autor_text = "N/A"
        autor_elem = item.select_one("div.a-row.a-size-base.a-color-secondary")
        if autor_elem:
            bloco_text = autor_elem.get_text(" ", strip=True)
            if "por" in bloco_text:
                autor_text = bloco_text.split("por")[-1].split("|")[0].strip()

        dados = {
            "titulo": titulo_text,
            "autor": autor_text,
            "preco": preco_text,
            "link": link_text,
            "avaliacao": avaliacao_text,
            "edicao": "N/A"
        }
        resultados.append(dados)
        if len(resultados) >= 3:  # Limita a 3 resultados para demonstração
            break

    return resultados

#############################################
# Parte 2: Sistema de Pesquisa e Download no BaixeLivros
#############################################
def buscar_baixelivros(titulo):
    """
    Realiza a busca no BaixeLivros para o título informado e retorna o HTML da página de resultados.
    """
    base_url = "https://www.baixelivros.com.br/"
    params = {"s": titulo}
    try:
        response = requests.get(base_url, headers=get_random_headers(), params=params, timeout=15)
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(f"Erro ao buscar no BaixeLivros: {e}")
        return None

def extrair_resultados_busca(html):
    """
    Extrai os itens de resultado da página de busca do BaixeLivros.
    Cada resultado é extraído a partir da tag <article> e contém título e link para a página do livro.
    """
    soup = BeautifulSoup(html, "html.parser")
    resultados = []
    
    # Procura por artigos que representam os livros
    for article in soup.find_all("article"):
        a_tag = article.find("a", class_="post-url")
        if a_tag:
            titulo = a_tag.get_text(strip=True)
            link = a_tag["href"]
            resultados.append({"titulo": titulo, "link": link})
    return resultados

def extrair_link_download(html):
    """
    A partir do HTML da página do livro no BaixeLivros, extrai o link de download.
    Procura pela tag <a> com id "botaodownloadoriginal" e utiliza o atributo "data-target".
    """
    soup = BeautifulSoup(html, "html.parser")
    download_a = soup.find("a", id="botaodownloadoriginal")
    if download_a and download_a.has_attr("data-target"):
        return download_a["data-target"]
    return None

def download_file(url, filename):
    """
    Realiza o download do arquivo a partir da URL informada e salva-o com o nome 'filename'.
    """
    try:
        print(f"Iniciando download do arquivo: {url}")
        response = requests.get(url, headers=get_random_headers(), stream=True, timeout=30)
        response.raise_for_status()
        with open(filename, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        print(f"Download concluído. Arquivo salvo como {filename}")
    except Exception as e:
        print(f"Erro ao realizar download: {e}")

#############################################
# Integração dos Sistemas e Interface com o Usuário
#############################################
def main():
    print("=== Buscador de Livros (Amazon e BaixeLivros) ===")
    
    while True:
        titulo_input = input("\nDigite o título do livro (ou 'sair' para encerrar): ").strip()
        if titulo_input.lower() == "sair":
            break
        if not titulo_input:
            print("Por favor, digite um título válido.")
            continue
        
        ###############################
        # Pesquisa na Amazon
        ###############################
        print("\nPesquisando na Amazon...")
        html_amazon = fazer_pesquisa_amazon(titulo_input)
        if html_amazon:
            resultados_amazon = extrair_dados_amazon(html_amazon)
            if resultados_amazon:
                print("\nResultados obtidos da Amazon:")
                for idx, livro in enumerate(resultados_amazon, 1):
                    print(f"\nResultado {idx}:")
                    print(f"Título: {livro['titulo']}")
                    print(f"Autor: {livro['autor']}")
                    print(f"Preço: {livro['preco']}")
                    print(f"Avaliação: {livro['avaliacao']}/5")
                    print(f"Link: {livro['link']}")
                    print("-" * 50)
            else:
                print("Nenhum resultado encontrado na Amazon.")
        else:
            print("Falha ao obter resultados da Amazon.")
        
        ###############################
        # Pesquisa no BaixeLivros
        ###############################
        print("\nPesquisando no BaixeLivros...")
        html_baixe = buscar_baixelivros(titulo_input)
        if not html_baixe:
            print("Falha ao obter resultados da busca no BaixeLivros.")
            continue
        
        resultados_baixe = extrair_resultados_busca(html_baixe)
        if resultados_baixe:
            print("\nResultados encontrados no BaixeLivros:")
            for idx, item in enumerate(resultados_baixe, 1):
                print(f"{idx}. {item['titulo']} - {item['link']}")
        else:
            print("Nenhum resultado encontrado no BaixeLivros.")
            continue
        
        opcao = input("\nDeseja selecionar algum resultado do BaixeLivros para extrair o link de download? (s/n): ").strip().lower()
        if opcao != "s":
            continue
        
        try:
            escolha = int(input("Digite o número do resultado desejado: "))
            if escolha < 1 or escolha > len(resultados_baixe):
                print("Opção inválida.")
                continue
        except Exception as e:
            print("Entrada inválida.")
            continue
        
        url_resultado = resultados_baixe[escolha - 1]["link"]
        print(f"\nAcessando a página: {url_resultado}")
        try:
            response = requests.get(url_resultado, headers=get_random_headers(), timeout=15)
            response.raise_for_status()
            html_detalhe = response.text
        except Exception as e:
            print(f"Erro ao acessar a página do livro: {e}")
            continue
        
        link_download = extrair_link_download(html_detalhe)
        if link_download:
            print(f"\nLink de download encontrado: {link_download}")
            opcao_download = input("Deseja baixar o arquivo? (s/n): ").strip().lower()
            if opcao_download == "s":
                # Definindo o nome do arquivo com base na extensão (exemplo: PDF)
                if ".pdf" in link_download.lower():
                    filename = titulo_input.replace(" ", "_") + ".pdf"
                else:
                    filename = titulo_input.replace(" ", "_") + ".file"
                download_file(link_download, filename)
            else:
                print("Download cancelado.")
        else:
            print("Nenhum link de download foi encontrado nesta página.")
        
        # Pequena pausa antes da próxima busca
        time.sleep(1)

if __name__ == "__main__":
    main()
