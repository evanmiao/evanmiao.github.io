function escapeRegExp(str: string) {
  if (typeof str !== 'string') throw new TypeError('str must be a string!');

  // http://stackoverflow.com/a/6969486
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

const rParam = /:(\w*[^_\W])/g;

interface Options {
  segments?: {
    [key: string]: RegExp | string;
  }
}

export default class Permalink {
  rule: string;
  regex: RegExp;
  params: string[];

  constructor(rule: string, options: Options = {}) {
    if (!rule) { throw new TypeError('rule is required!'); }
    const segments = options.segments || {};
    const params = [];
    const regex = escapeRegExp(rule)
      .replace(rParam, (match, name) => {
        params.push(name);
        if (Object.prototype.hasOwnProperty.call(segments, name)) {
          const segment = segments[name];
          if (segment instanceof RegExp) {
            return segment.source;
          }
          return segment;
        }
        return '(.+?)';
      });
    this.rule = rule;
    this.regex = new RegExp(`^${regex}$`);
    this.params = params;
  }

  test(str: string) {
    return this.regex.test(str);
  }

  parse(str: string) {
    const match = str.match(this.regex);
    const { params } = this;
    const result = {};
    if (!match) { return; }
    for (let i = 1, len = match.length; i < len; i++) {
      result[params[i - 1]] = match[i];
    }
    return result;
  }

  stringify(data) {
    return this.rule.replace(rParam, (match, name) => {
      const descriptor = Object.getOwnPropertyDescriptor(data, name);
      if (descriptor && typeof descriptor.get === 'function') {
        throw new Error('Invalid permalink setting!');
      }
      return data[name];
    });
  }
}
