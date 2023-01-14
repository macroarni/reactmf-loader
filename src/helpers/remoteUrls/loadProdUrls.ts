import {TPromiseDefault} from "./interface";

const APP_MF_LINK = '__MF_CLIENT_LINK__';

const makeRequest: (url: string) => Promise<string> = async(url: string): Promise<string> => {
  try {
    const res: Response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
    });

    return res.text().then((data: string): string =>
      data
        .replace(/\s/g, '')
        .replace(/'/g, '"')
    );
  } catch (err) {
    return Promise.reject(err);
  }
};

const init: (data: string) => Promise<any> = (data: string): Promise<any> => {
  try {
    window[APP_MF_LINK] = JSON.parse(data);
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

const error: (err: any) => void = (err: any): void => {
  const element: HTMLDivElement = document.createElement("div");

  element.style.textAlign = "center";
  element.style.fontSize = "20px";
  element.style.margin = "0 auto";
  element.style.width = "500px";

  element.innerHTML = `
    ${err?.response?.status ?? ''}
    <hr>
    Something went wrong.
    <br>
    Please try again later.
  `;

  document.getElementById("root")?.appendChild(element);
  console.error('[loadProdUrls]: failed to load MF Urls(production)');
};

export const loadProdUrls = (url: string, boot: () => TPromiseDefault): void => {
  makeRequest(url)
    .then((data: string) =>
      init(data)
      .then((): TPromiseDefault => boot())
    ).catch((err: any): void => error(err));
};
