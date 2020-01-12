import { Mesh, Object3D } from 'three';

export function logObject(obj: Mesh) {
  const lines: string[] = [];
  let verts: number = 0;

  function logObj(obj: Mesh | Object3D, lines: string[] = [], isLast = true, prefix = '') {
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;

    // @ts-ignore
    if (obj.geometry && obj.geometry.index && obj.geometry.index.array) {
      // @ts-ignore
      verts += obj.geometry.index.array.length;
    }

    // @ts-ignore
    obj.children.forEach((child, ndx) => {
      const isLast = ndx === lastNdx;
      logObj(child, lines, isLast, newPrefix);
    });

    return lines;
  }

  logObj(obj, lines);

  console.log(lines.join('\n'));
  console.log('verts = ', verts);
}

export function filterObj(scene: Object3D, blackList: string[]) {
  if (scene.children && scene.children.length) {
    scene.children.forEach((child, index) => {
      if (needDelete(child, blackList)) {
        scene.children[index] = new Object3D();
      } else {
        this.filterObj(child);
      }
    });
  }
}

const needDelete = (item: any, blackList: string[]): boolean => {
  if (item.name === '') {
    return false;
  }

  for (let i = 0; i < blackList.length; i++) {
    if (item.name.includes(blackList[i])) {
      return true;
    }
  }

  return false;
};
