const uniq = (l, uniqBy) => l.filter((element, index, self) => self.find((e) => uniqBy(e) === uniqBy(element)) === element);

export default uniq;
