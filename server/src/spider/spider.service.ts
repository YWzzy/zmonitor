import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import * as cheerio from "cheerio";
import { CreateSpiderDto } from "./dto/create-spider.dto";
import { QueryDto } from "./dto/query-spider.dto";

@Injectable()
export class SpiderService {
  create(createSpiderDto: CreateSpiderDto) {
    return "This action adds a new spider";
  }

  findAll(httpService: HttpService, queryDto: any) {
    const next = "下一页";
    let index = 0;
    let totalPage = 0;
    let urls: string[] = [];
    console.log("queryDto", queryDto);
    // const url = `https://wallhaven.cc/search?q=${queryDto.query}&categories=${queryDto.categories}&purity=${queryDto.purity}&atleast=${queryDto.atleast}&topRange=${queryDto.topRange}&sorting=${queryDto.sorting}&order=${queryDto.order}&page=${queryDto.page}`;

    //wallhaven.cc/search?categories=110&purity=100&atleast=1920x1080&topRange=1M&sorting=toplist&order=desc&ai_art_filter=1
    // const url = `https://wallhaven.cc/search?categories=${queryDto.categories}&purity=${queryDto.purity}&atleast=${queryDto.atleast}&topRange=${queryDto.topRange}&sorting=${queryDto.sorting}&order=${queryDto.order}&page=${queryDto.page}`;

    // console.log("url", url);
    const getImgs = async (page = 4) => {
      urls = [];
      const url = `https://wallhaven.cc/search?categories=${queryDto.categories}&purity=${queryDto.purity}&atleast=${queryDto.atleast}&topRange=${queryDto.topRange}&sorting=${queryDto.sorting}&order=${queryDto.order}&page=${queryDto.page}`;

      console.log("url", url);
      // for (let i = 0; i < page; i++) {
      await httpService
        .axiosRef({
          url: url,
          method: "get",
          data: {
            categories: 110,
            purity: 100,
            atleast: "1920x1080",
            topRange: "1M",
            sorting: "toplist",
            order: "desc",
            page: queryDto.page,
          },
          headers: {
            "Cache-Control": "no-cache",
            "Content-Type": "text/html; charset=UTF-8",
            "Postman-Token": Date.now(),
            // Accept:
            //   "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            // "Accept-Encoding": "gzip, deflate, br",
            // "Accept-Language": "zh-CN,zh;q=0.9",
            // "Sec-Ch-Ua": `"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"`,
            // "Sec-Ch-Ua-Mobile": "?0",
            // "Sec-Ch-Ua-Platform": "Windows",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            "X-Forwarded-For": new Array(4)
              .fill(0)
              .map(() => parseInt(String(Math.random() * 255), 10))
              .join("."), // 构造ip
          },
        })
        .then(async (res) => {
          const $ = cheerio.load(res.data);
          const page = $(".thumb-listing-page ul li figure img");
          // const pagea = $(".thumb-listing-page ul li figure a");
          const pageNum = $(".thumb-listing-page header h2");

          page.each(function () {
            let url = $(this).attr("data-src");
            let t = url.substring(url.length - 13, url.length - 11);
            let w = url.substring(url.length - 10, url.length);
            urls.push(`https://w.wallhaven.cc/full/${t}/wallhaven-${w}`);
          });
          // console.log("pagea", pagea);
          pageNum.each(function () {
            let num = $(this).text();
            const regex = /\d+/g;
            totalPage = Number(num.match(regex)[1]);
            // console.log("pageNum", num.match(regex)[0]);
          });
          console.log("totalPage", totalPage);
          // pagea.each(function () {
          //   let url = $(this).attr("href");
          //   urls.push(url);
          // });
          console.log("urls", urls);
          let downUrls = [] as any;
          await this.IsPngOrJpg(urls, httpService).then((res) => {
            downUrls = res;
            console.log("downUrls", downUrls);
            this.wirteToTxtFile("", downUrls, httpService, queryDto.page);
          });

          console.log("totalPage2", totalPage);
          if (totalPage >= queryDto.page + 1) {
            ++queryDto.page;
            console.log("currentPage", queryDto.page);
            getImgs();
          } else {
            urls = [];
            downUrls = [];
          }

          // if (queryDto.page == totalPage) {
          //   await this.IsPngOrJpg(urls, httpService).then((res) => {
          //     downUrls = res;
          //     this.wirteToTxtFile(downUrls, httpService, queryDto.page);
          //   });
          // }

          // 下载文件到指定目录
          // this.wirteFile(urls, httpService);
          // await this.wirteToTxtFile(downUrls, httpService, queryDto.page);

          // .map(function () {
          //   return $(this).text();
          // })
          // .toArray();
        })
        .catch((err) => {
          console.log("err", queryDto.page + "请求出错: err=" + err);
          getImgs();
        });
      // }
    };
    getImgs();
    return "cos";
  }

  getPosters(httpService: HttpService, queryDto: any) {
    const next = "下一页";
    let index = 0;
    let totalPage = 0;
    let urls: string[] = [];
    console.log("queryDto", queryDto);
    // const url = `https://wallhaven.cc/search?q=${queryDto.query}&categories=${queryDto.categories}&purity=${queryDto.purity}&atleast=${queryDto.atleast}&topRange=${queryDto.topRange}&sorting=${queryDto.sorting}&order=${queryDto.order}&page=${queryDto.page}`;

    //wallhaven.cc/search?categories=110&purity=100&atleast=1920x1080&topRange=1M&sorting=toplist&order=desc&ai_art_filter=1
    const url = `https://wallhaven.cc/search?categories=${queryDto.categories}&purity=${queryDto.purity}&atleast=${queryDto.atleast}&topRange=${queryDto.topRange}&sorting=${queryDto.sorting}&order=${queryDto.order}&page=${queryDto.page}`;

    console.log("url", url);
    const getPoster = async (page = 4) => {
      urls = [];
      // for (let i = 0; i < page; i++) {
      await httpService
        .axiosRef({
          url: url,
          method: "get",
          data: {
            categories: 110,
            purity: 100,
            atleast: "1920x1080",
            topRange: "1M",
            sorting: "toplist",
            order: "desc",
            page: queryDto.page,
          },
          headers: {
            "Cache-Control": "no-cache",
            "Content-Type": "text/html; charset=UTF-8",
            "Postman-Token": Date.now(),
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Sec-Ch-Ua": `"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"`,
            "Sec-Ch-Ua-Mobile": "?0",
            "Sec-Ch-Ua-Platform": "Windows",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            "X-Forwarded-For": new Array(4)
              .fill(0)
              .map(() => parseInt(String(Math.random() * 255), 10))
              .join("."), // 构造ip
            Cookie:
              "_pk_id.1.01b8=b69050a42f27d9cd.1687764528.; _pk_ses.1.01b8=1; XSRF-TOKEN=eyJpdiI6IndhYlBcL1FCYmxwWGtxdnlrdDVtN1l3PT0iLCJ2YWx1ZSI6IjUxWkNoSUVZRGdONGhVNFZsRkpcLzRSbWtkZjBORTZhZHE4QUpxanNlQktNajhwR1wvekRwbzFQaWtaZEdUZmt6UCIsIm1hYyI6ImJlMmRiMmNiYzlhNDgyODg1OWRkNTIwYTk1ZTc0ODlkYmUwY2ZlNWI0ODFmMjgxYzljNWRjMGIyY2VmNDQxZTcifQ%3D%3D; wallhaven_session=eyJpdiI6IkhMYnpqYmF4S1JDNHBPcitQYVNUbVE9PSIsInZhbHVlIjoiVkVwK3h4SGRPSDRCUjFQaERDVDlLeGwwOG9lUWl3REZvV0tDdHRUbk12SFozcERcL0xWVHZcL3hGdjRTWUxvT2JWIiwibWFjIjoiMDQ3NjIzOWZjZGE5OWY1MjgyNWIyODgzZjI0YTdkYWYzNDkzYWRhYmUzZTFhZmZiMDhkMThiNDZlMTU2NzcwZCJ9",
          },
        })
        .then(async (res) => {
          const $ = cheerio.load(res.data);
          const page = $(".thumb-listing-page ul li figure img");
          const pageNum = $(".thumb-listing-page header h2");

          page.each(function () {
            let url = $(this).attr("data-src");
            urls.push(url);
          });
          pageNum.each(function () {
            let num = $(this).text();
            const regex = /\d+/g;
            totalPage = Number(num.match(regex)[1]);
          });
          console.log("urls", urls);
          this.wirteToTxtFile("poster/", urls, httpService, queryDto.page);
          if (totalPage >= queryDto.page + 1) {
            ++queryDto.page;
            console.log("currentPage", queryDto.page);
            getPoster();
          } else {
            urls = [];
          }
        })
        .catch((err) => {
          console.log("err", queryDto.page + "请求出错: err=" + err);
          getPoster();
        });
      // }
    };
    getPoster();
    return "cos";
  }

  // 访问图片路径获取高清资源
  getHighRes(urls, httpService) {
    urls.forEach(async (url) => {
      if (url) {
        console.log("url", url);
        await httpService
          .axiosRef({
            url: url,
            method: "get",
          })
          .then((res) => {
            const $ = cheerio.load(res.data);
            // 获取元素标签
            const page = $(".showcase .scrollbox img");
            let picUrls = [];
            // 获取标签下url
            page.each(function () {
              let picUrl = $(this).attr("src");
              picUrls.push(picUrl);
            });
            console.log("picUrls", picUrls);
          })
          .catch((err) => {
            console.log("err");
          });
      }
    });
  }

  // 判断jpg/png是否有效
  // 访问图片路径获取高清资源
  async IsPngOrJpg(zurls, httpService) {
    return new Promise(async (resolve, reject) => {
      const myHttpService = {
        myAxios(options) {
          const urlz = options.opUrl;
          // setTimeout(() => {
          return new Promise((resolve, reject) => {
            httpService
              .axiosRef({
                url: urlz,
                method: options.method,
                headers: options.headers,
              })
              .then(() => {
                console.log("success", urlz);
                resolve(urlz);
              })
              .catch((err) => {
                console.log("err", urlz, "err=" + err);
                if (err.toString().indexOf("connect ETIMEDOUT") != -1) {
                  let turl =
                    urlz.indexOf(".jpg") == -1
                      ? urlz.replace(".png", ".jpg")
                      : urlz.replace(".jpg", ".png");
                  resolve(turl);
                } else {
                  resolve(null);
                }
              });
          });
          // }, 10);
        },
      };

      Promise.all(
        zurls.map((item) =>
          myHttpService.myAxios({
            opUrl: item,
            method: "get",
            headers: {
              "Cache-Control": "no-cache",
              "Content-Type": "text/html; charset=UTF-8",
              "Postman-Token": Date.now(),
              // Accept:
              //   "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
              // "Accept-Encoding": "gzip, deflate, br",
              // "Accept-Language": "zh-CN,zh;q=0.9",
              // "Sec-Ch-Ua": `"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"`,
              // "Sec-Ch-Ua-Mobile": "?0",
              // "Sec-Ch-Ua-Platform": "Windows",
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
              "X-Forwarded-For": new Array(4)
                .fill(0)
                .map(() => parseInt(String(Math.random() * 255), 10))
                .join("."), // 构造ip
            },
          })
        )
      )

        .then((responses) => {
          // const picUrls = responses.map((response) => response.data.url);
          // console.log("图片 URL:", responses);
          resolve(responses);
        })

        .catch((error) => {
          console.error("请求失败：", error);
          reject();
        });
    });
  }

  // 将文件写入本地目录
  wirteFile(urls: string[], httpService: HttpService) {
    const fs = require("fs");
    const path = require("path");
    urls.forEach(async (url) => {
      await httpService
        .axiosRef(url, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          const index = url.indexOf("-");
          let name = url.slice(index + 1);
          const buffer = res.data;
          const ws = fs.createWriteStream(
            // path.join(__dirname, "../images/" + new Date().getTime() + ".jpg")
            path.join(__dirname, "../images/" + name)
          );
          ws.write(buffer);
        })
        .catch((err) => {});
    });
  }

  // 将图片数组转成txt文件写入本地目录
  wirteToTxtFile(
    zPath: string = "",
    urls: string[],
    httpService: HttpService,
    page
  ) {
    const fs = require("fs");
    const path = require("path");
    const txt = urls.join("\n");
    const buffer = Buffer.from(txt, "utf8");
    const ws = fs.createWriteStream(
      path.join(
        __dirname,
        "../images/" + zPath + `${zPath ? "z" : "p"}` + page + "wallhaven.txt"
      )
    );
    ws.write(buffer);
  }
}
