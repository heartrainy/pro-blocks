import { parse } from 'url';
import moment from 'moment';

// mock tableListDataSource
let tableListDataSource: any[] = [];

for (let i = 0; i < 1; i += 1) {
  tableListDataSource.push({
    key: i,
    column1: `column1_${i}`,
    column2: Math.floor(Math.random() * 10) % 4,
    column3: Math.floor(Math.random() * 1000),
    column4: new Date(`2019-07-${Math.floor(i / 2) + 1}`).getTime(),
    column5: Math.floor(Math.random() * 10) % 4,
    href: 'https://ant.design',
    avatar: [
      'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
      'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
    ][i % 2],
    name: `TradeCode ${i}`,
    title: `一个任务名称 ${i}`,
    owner: '曲丽丽',
    desc: '这是一段描述',
    callNo: Math.floor(Math.random() * 1000),
    status: Math.floor(Math.random() * 10) % 4,
    updatedAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    createdAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    progress: Math.ceil(Math.random() * 100),
  });
}

function getRule(
  req: { url: any },
  res: {
    json: (
      arg0: {
        list: any[];
        pagination: { total: number; pageSize: number; current: number };
      },
    ) => void;
  },
  u: any,
) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = parse(url, true).query;

  let dataSource = tableListDataSource;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource: any[] = [];
    status.forEach((s: string) => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(item => {
          if (parseInt(`${item.status}`, 10) === parseInt(s.split('')[0], 10)) {
            return true;
          }
          return false;
        }),
      );
    });
    dataSource = filterDataSource;
  }

  if (params.column1) {
    dataSource = dataSource.filter(data => data.column1.indexOf(params.column1) > -1);
  }

  if (params.column2) {
    dataSource = dataSource.filter(data => data.column2 == params.column2);
  }

  if (params.column3) {
    dataSource = dataSource.filter(data => data.column3 == params.column3);
  }

  if (params.column4) {
    dataSource = dataSource.filter(data => data.column4 <= moment(params.column4).valueOf());
  }

  if (params.column5) {
    dataSource = dataSource.filter(data => data.column5 == params.column5);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 0);
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(`${params.currentPage}`, 10) || 1,
    },
  };

  return res.json(result);
}

function postRule(
  req: { url: any; body: any },
  res: { json: (arg0: { list: any[]; pagination: { total: number } }) => void },
  u: any,
  b: { body: any },
) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, key, column1, column2, column3, column4, column5 } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        key: i,
        column1: column1,
        column2: column2,
        column3: column3,
        column4: column4,
        column5: column5,
        href: 'https://ant.design',
        avatar: [
          'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
          'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
        ][i % 2],
        name: `TradeCode ${i}`,
        title: `一个任务名称 ${i}`,
        owner: '曲丽丽',
        desc,
        callNo: Math.floor(Math.random() * 1000),
        status: Math.floor(Math.random() * 10) % 2,
        updatedAt: new Date(),
        createdAt: new Date(),
        progress: Math.ceil(Math.random() * 100),
      });
      break;
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        if (item.key === key) {
          return { ...item, column1, column2, column3, column4, column5 };
        }
        return item;
      });
      break;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  return res.json(result);
}

export default {
  'GET /api/rule': getRule,
  'POST /api/rule': postRule,
};
