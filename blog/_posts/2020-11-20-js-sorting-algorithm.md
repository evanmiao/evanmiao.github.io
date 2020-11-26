---
title: JavaScript 排序算法
date: 2020-11-20
tags:
  - JavaScript
  - 学习笔记
  - 算法
summary: 冒泡排序、选择排序、插入排序、希尔排序、归并排序、快速排序、堆排序、计数排序、桶排序、基数排序
---

## 冒泡排序（Bubble Sort）

重复地走访过要排序的数列，一次比较两个元素，如果他们的顺序错误就把他们交换过来。走访数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。这个算法的名字由来是因为越小的元素会经由交换慢慢“浮”到数列的顶端。

- 步骤
  1. 比较相邻的元素。如果第一个比第二个大，就交换他们两个。
  2. 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对。这步做完后，最后的元素会是最大的数。
  3. 针对所有的元素重复以上的步骤，除了最后一个。
  4. 持续每次对越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较。

```js
function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // 交换两个变量的值
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }
  return arr
}
```

## 选择排序（Selection Sort）

首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置，然后，再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。以此类推，直到所有元素均排序完毕。

```js
function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let min = i
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[min] > arr[j]) min = j
    }
    [arr[i], arr[min]] = [arr[min], arr[i]]
  }
  return arr
}
```

## 插入排序（Insertion Sort）

通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。

- 步骤
  1. 从第一个元素开始，该元素可以认为已经被排序
  2. 取出下一个元素，在已经排序的元素序列中从后向前扫描
  3. 如果该元素（已排序）大于新元素，将该元素移到下一位置
  4. 重复步骤3，直到找到已排序的元素小于或者等于新元素的位置
  5. 将新元素插入到该位置后
  6. 重复步骤2~5

```js
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const temp = arr[i]
    for (var j = i - 1; j >= 0 && arr[j] > temp; j--) {
      arr[j + 1] = arr[j]
    }
    arr[j + 1] = temp
  }
  return arr
}
```

## 希尔排序（Shell Sort）

也称递减增量排序，是插入排序的一种更高效的改进版本。它与插入排序的不同之处在于，它会优先比较距离较远的元素。

希尔排序通过将比较的全部元素分为几个区域来提升插入排序的性能。这样可以让一个元素可以一次性地朝最终位置前进一大步。然后算法再取越来越小的步长进行排序，算法的最后一步就是普通的插入排序，但是到了这步，需排序的数据几乎是已排好的了（此时插入排序较快）。

步长的选择是希尔排序的重要部分。只要最终步长为 1 任何步长序列都可以工作。算法最开始以一定的步长进行排序。然后会继续以一定步长进行排序，最终算法以步长为 1 进行排序。当步长为 1 时，算法变为普通插入排序，这就保证了数据一定会被排序。

一般情况下，初次取序列的一半为步长，以后每次减半，直到步长为 1 。

```js
function shellSort(arr) {
  for (let gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
    // 内层循环与插入排序的写法基本一致，只是每次移动的步长变为 gap
    for (let i = gap; i < arr.length; i++) {
      const temp = arr[i]
      for (var j = i - gap; j >= 0 && arr[j] > temp; j -= gap) {
        arr[j + gap] = arr[j]
      }
      arr[j + gap] = temp
    }
  }
  return arr
}
```

## 归并排序（Merge Sort）

归并排序是建立在归并操作上的一种有效的排序算法。该算法是采用分治法（Divide and Conquer）的一个非常典型的应用。

归并操作（merge），也叫归并算法，指的是将两个已经排序的序列合并成一个序列的操作。

- 分治法:
  - 分割：递归地把当前序列平均分割成两半。
  - 集成：在保持元素顺序的同时将上一步得到的子序列集成到一起（归并）。

![merge-sort.png](https://i.loli.net/2020/11/21/9TPjmAK3pSCOnw1.png)

```js
function mergeSort(arr) {
  if (arr.length < 2) return arr
  const middle = Math.floor(arr.length / 2),
    left = arr.slice(0, middle),
    right = arr.slice(middle)
  return merge(mergeSort(left), mergeSort(right))
}

function merge(left, right) {
  const result = []
  while (left.length && right.length) {
    if (left[0] < right[0]) {
      result.push(left.shift())
    } else {
      result.push(right.shift())
    }
  }
  return result.concat(left, right)
}
```

## 快速排序（Quick Sort）

快速排序使用分治法策略来把一个序列分为较小和较大的两个子序列，然后递归地排序两个子序列。

- 步骤：
  1. 挑选基准值：从数列中挑出一个元素，称为“基准”（pivot）
  2. 分割：重新排序数列，所有比基准值小的元素摆放在基准前面，所有比基准值大的元素摆在基准后面（与基准值相等的数可以到任何一边）。在这个分割结束之后，对基准值的排序就已经完成
  3. 递归排序子序列：递归地将小于基准值元素的子序列和大于基准值元素的子序列排序

简单版本：

```js
function quickSort(arr) {
  if (arr.length < 2) return arr

  const left = [],
    right = [],
    pivot = arr[0],  // 选取第一个元素为基准
    pivotList = [pivot]

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }

  return quickSort(left).concat(pivotList, quickSort(right))
}
```

上面简单版本的缺点是，它需要额外存储空间，也就跟归并排序一样不好。额外需要的存储器空间配置，在实际上的实现，也会极度影响速度和缓存的性能。

原地（in-place）分割算法的版本：

```js
function quickSort(array) {
  function sort(arr, start = 0, end = arr.length - 1) {
    if (start >= end) return  // 递归结束
    let i = start, j = end
    const pivot = arr[i]  // 选取第一个元素为基准
    while (i < j) {
      while (i < j && arr[j] > pivot) {
        j--
      }
      if (i < j) {
        arr[i] = arr[j]
        i++
      }
      while (i < j && arr[i] < pivot) {
        i++
      }
      if (i < j) {
        arr[j] = arr[i]
        j--
      }
    }
    arr[i] = pivot  // 基准归位 此时 i 等于 j
    sort(arr, start, i - 1)
    sort(arr, i + 1, end)
  }
  sort(array)
  return array
}
```

## 堆排序（Heap Sort）

指利用堆这种数据结构所设计的一种排序算法。堆是一个近似完全二叉树的结构，并同时满足堆的性质：即子节点的键值或索引总是小于（或者大于）它的父节点。

```js
function heapSort(arr) {
  function swap(i, j) {
    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }

  function max_heapify(start, end) {
    let dad = start
    let son = dad * 2 + 1
    if (son >= end) return
    if (son + 1 < end && arr[son] < arr[son + 1]) son++
    if (arr[dad] <= arr[son]) {
      swap(dad, son)
      max_heapify(son, end)
    }
  }

  let len = arr.length
  // 初始化，i 从最后一个父节点开始调整
  for (let i = Math.floor(len / 2) - 1; i >= 0; i--) max_heapify(i, len)
  // 先将第一个元素和已排好元素前一位做交换，再从新调整，直到排序完毕
  for (let i = len - 1; i > 0; i--) {
    swap(0, i)
    max_heapify(0, i)
  }

  return arr
}
```

## 计数排序（Counting Sort）

计数排序使用一个额外的数组 C ，其中第 i 个元素是待排序数组中值等于 i 的元素的个数。然后根据数组 C 将待排序数组中的元素排到正确的位置。

```js
function countingSort(arr) {
  const C = []
  let sortedIndex = 0
  for (let i = 0; i < arr.length; i++) {
    if (C[arr[i]] >= 1) {
      C[arr[i]]++
    } else {
      C[arr[i]] = 1
    }
  }
  for (let j = 0; j < C.length; j++) {
    if (C[j]) {
      while (C[j] > 0) {
        arr[sortedIndex++] = j
        C[j]--
      }
    }
  }
  return arr
}
```

## 桶排序（Bucket Sort）

将阵列分到有限数量的桶里。每个桶再个别排序（有可能再使用别的排序演算法或是以递回方式继续使用桶排序进行排序）。

- 步骤：
  1. 设置一个定量的阵列当作空桶子。
  2. 寻访序列，并且把项目一个一个放到对应的桶子去。
  3. 对每个不是空的桶子进行排序。
  4. 从不是空的桶子里把项目再放回原来的序列中。

```js
function bucketSort(arr, bucketNum) {
  function swap(arr, i, j) {
    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }

  const max = Math.max(...arr)
  const min = Math.min(...arr)

  const buckets = []
  const bucketsSize = Math.floor((max - min) / bucketNum) + 1

  for (let i = 0; i < arr.length; i++) {
    const index = Math.floor(arr[i] / bucketsSize)
    if (!buckets[index]) buckets[index] = []
    buckets[index].push(arr[i])

    for (let j = buckets[index].length; j > 0; j--) {
      if (buckets[index][j] < buckets[index][j - 1]) {
        swap(buckets[index], j, j - 1)
      }
    }
  }

  arr.length = 0
  for (let i = 0; i < buckets.length; i++) {
    if (buckets[i]) arr = arr.concat(buckets[i])
  }
  return arr
}
```

## 基数排序（Radix Sort）

一种非比较型整数排序算法，其原理是将整数按位数切割成不同的数字，然后按每个位数分别比较。由于整数也可以表达字符串（比如名字或日期）和特定格式的浮点数，所以基数排序也不是只能使用于整数。

基数排序的方式可以采用LSD（Least significant digital）或MSD（Most significant digital），LSD的排序方式由键值的最右边开始，而MSD则相反，由键值的最左边开始。

基数排序 vs 计数排序 vs 桶排序：

- 计数排序：每个桶只存储单一键值；
- 桶排序：每个桶存储一定范围的数值；
- 基数排序：根据键值的每位数字来分配桶；

```js
//LSD Radix Sort
var counter = []
function radixSort(arr, maxDigit) {
  var mod = 10
  var dev = 1
  for (var i = 0; i < maxDigit; i++, dev *= 10, mod *= 10) {
    for (var j = 0; j < arr.length; j++) {
      var bucket = parseInt((arr[j] % mod) / dev)
      if (counter[bucket] == null) {
        counter[bucket] = []
      }
      counter[bucket].push(arr[j])
    }
    var pos = 0
    for (var j = 0; j < counter.length; j++) {
      var value = null
      if (counter[j] != null) {
        while ((value = counter[j].shift()) != null) {
          arr[pos++] = value
        }
      }
    }
  }
  return arr
}
```
