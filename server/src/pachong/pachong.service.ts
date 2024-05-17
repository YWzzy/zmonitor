// import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { CreatePachongDto } from "./dto/create-pachong.dto";
import { UpdatePachongDto } from "./dto/update-pachong.dto";
import { QueryPachongDto } from "./dto/query-pachong.dto";
import * as cheerio from "cheerio";
import axios from "axios";
const iconv = require("iconv-lite");

@Injectable()
export class PachongService {
  create(createPachongDto: CreatePachongDto) {
    return "This action adds a new pachong";
  }

  async findAll(queryPachongDto: QueryPachongDto) {
    const page = await this.getCarImgsInfo(queryPachongDto.query);
    return page;
  }

  async findCarInfo(queryPachongDto: QueryPachongDto) {
    console.log("2", queryPachongDto.query);
    const page = await this.getCarInfo(queryPachongDto.query);
    return page;
  }

  getCarInfo = async (url) => {
    return new Promise((resolve, reject) => {
      axios.get(url, { responseType: "arraybuffer" }).then(async (res) => {
        let str = iconv.decode(Buffer.from(res.data), "gb2312");

        const $ = cheerio.load(iconv.encode(str, "utf8").toString());
        const objectRegex = /var window.detailData = \{.*?\};/;
        $("script")
          .map(function () {
            const match = $(this).html().match(objectRegex);
            const objectString = match && match[1];
            console.log("objectString", objectString);
          })
          .get();
        // const page = $(
        //   ".root > #bd > #bd_0 > .grid960 > #8919138061 > .module-product-list > .next-loading > .next-loading-wrap > *"
        // ).children();
        // page.each((i, elem) => {
        //   console.log("test", elem.attributes);
        // });
        // const test = page.attr("id");
        // console.log("test", res.headers["window"]);
        // resolve(test);
      });
    });
  };

  getCarImgsInfo = async (url) => {
    return new Promise((resolve, reject) => {
      axios.get(url, { responseType: "arraybuffer" }).then(async (res) => {
        let str = iconv.decode(Buffer.from(res.data), "gb2312");
        const $ = cheerio.load(iconv.encode(str, "utf8").toString());
        const page = $(".content .row .fn-visible .row")
          .last()
          .children()
          .children();
        const seriesInfoUrl = page.children().children().attr("href");
        let categoriesList = [];
        let pageList = [];
        const series = $(".cartab-title .cartab-title-name a").text();
        const carBodyImgUrl =
          "https://car.autohome.com.cn/" +
          $(".cartab-title").nextAll().eq(1).children().children().attr("href");

        $(".cartab-title")
          .nextAll()
          .each(function (i, elem) {
            let requestInfo = {
              url: "",
              categories: "",
            };
            requestInfo.url =
              "https://car.autohome.com.cn" +
              $(this).children().first().children().first().attr("href");
            requestInfo.categories = $(this)
              .children()
              .first()
              .children()
              .eq(0)
              .text();
            if (requestInfo.url && requestInfo.url.indexOf("vr") == -1)
              categoriesList.push(requestInfo);
          });

        let images = {
          name: series,
          categoriesList: [],
        };
        for (let i = 0; i < categoriesList.length; i++) {
          let temp = await this.hasPage(
            series,
            categoriesList[i].categories,
            categoriesList[i].url
          );
          images.categoriesList.push(temp);
        }
        resolve(images);
      });
    });
  };

  // 判断是否分页
  hasPage = async (series, categories, url) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        axios
          .get(url)
          .then(async (res) => {
            let str = iconv.decode(Buffer.from(res.data), "gb2312");
            const $ = cheerio.load(iconv.encode(str, "utf8").toString());
            let pageUrls: any[] = [];
            pageUrls.push({
              type: categories,
              url: url,
            });
            const page = $(".pagecont .page a").each(function (i, elem) {
              let pageObj = {
                type: categories,
                url: "https://car.autohome.com.cn" + $(this).attr("href"),
              };
              if (!$(this).attr("class")) {
                pageUrls.push(pageObj);
              }
            });
            // console.log(pageUrls);
            let obj: { [key: string]: any } = {
              name: series,
              count: 0,
              images: [] as Array<[]>,
            };
            let a: Array<[]> = [];
            for (let i = 0; i < pageUrls.length; i++) {
              let temp: any = await this.getCarImgs(
                pageUrls[i].type,
                pageUrls[i].url
              );
              a = a.concat(temp);
              obj[`images`] = a;
              obj[`count`] = obj[`images`].length;
            }
            await this.jsonToExcel(obj.images);
            resolve(obj);
          })
          .catch((err) => {
            reject(err);
          });
      }, 1000);
    });
  };

  // 开始爬取图片
  getCarImgs = async (categories, url) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        axios
          .get(url)
          .then(async (res) => {
            let str = iconv.decode(Buffer.from(res.data), "gb2312");
            const $ = cheerio.load(iconv.encode(str, "utf8").toString());
            let imgs = [];
            const page = $(
              ".content .row .contentright .row .grid-16 .uibox .carpic-list03 ul li"
            ).each(function (i, elem) {
              let carInfo = {
                image:
                  "https://car.autohome.com.cn/" +
                  $(this).children().attr("href"),
                title: $(this).children().attr("title"),
              };
              let mini = $(this).children().children().attr("src");
              let allSize = $(this)
                .children()
                .children()
                .attr("src")
                .replace("480x360", "1400x0");
              let carSimple = {
                categories: categories,
                imageMiniSize: mini.includes("//")
                  ? mini.includes("http")
                    ? mini
                    : "http:" + mini
                  : "https://car3.autoimg.cn/" + mini,
                imageAllSize: allSize.includes("//")
                  ? allSize.includes("http")
                    ? allSize
                    : "http:" + allSize
                  : "https://car3.autoimg.cn/" + allSize,
                title: $(this).children().children().text(),
              };
              imgs.push(carSimple);
            });
            // console.log(imgs);
            resolve(imgs);
          })
          .catch((err) => {
            reject(err);
          });
      }, 1000);
    });
  };

  // json数据转为excel
  jsonToExcel(jsonData) {
    const json2xls = require("json2xls");
    const fs = require("fs");
    const path = require("path");

    const xls = json2xls(jsonData);
    fs.writeFileSync(
      path.join(__dirname, "../qczj/" + "data.xlsx"),
      xls,
      "binary"
    );
  }

  // 将文件写入本地目录
  wirteFile(urls: string[]) {
    const fs = require("fs");
    const path = require("path");
    urls.forEach(async (url) => {
      await axios
        .get(url, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          const index = url.indexOf("-");
          let name = url.slice(index + 1);
          const buffer = res.data;
          const ws = fs.createWriteStream(
            // path.join(__dirname, "../images/" + new Date().getTime() + ".jpg")
            path.join(__dirname, "../qczj/" + name)
          );
          ws.write(buffer);
        })
        .catch((err) => {});
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} pachong`;
  }

  update(id: number, updatePachongDto: UpdatePachongDto) {
    return `This action updates a #${id} pachong`;
  }

  remove(id: number) {
    return `This action removes a #${id} pachong`;
  }
}
