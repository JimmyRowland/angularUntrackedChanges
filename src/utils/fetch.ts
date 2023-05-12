export type Entry = {
  name: string,
    id: number,
    editableSlow: () => Promise<boolean>
}

function getEntry(index: number): Entry {
  return {
    name: `entry${index}`,
    id: index,
    editableSlow: () => new Promise(resolve => {
      setTimeout(() => resolve(index % 3 === 0), 1000)
    })
  }
}

export function fetchEntries(numberOfEntries: number): Promise<Array<Entry>> {
  return new Promise(resolve => {
    setTimeout(() => resolve(Array(numberOfEntries).fill(0).map((value, index) => getEntry(index))), 500)
  })
}
