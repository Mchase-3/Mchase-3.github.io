---
title: 暴力数据结构-珂朵莉树(ODT)
toc: true
mathjax: true
copyright: true
date: 2020-04-18 17:09:17
top: 50
tags:
 - 暴力数据结构
 - 算法
categories:
 - 算法笔记
---

### 暴力数据结构-珂朵莉树(ODT)

<!--more-->

![珂朵莉001](001.jpg)

（图片来自[哔哩哔哩](https://www.bilibili.com/read/cv146458?from=category_2)）

#### 介绍

**珂朵莉树(Chtholly Tree，又称Old Driver Tree(ODT))**，据说来源于[CF896C](https://codeforces.com/problemset/problem/896/C)，此题要求支持下列操作：

- 区间加
- 区间赋值
- 求区间第 $k$ 小值
- 求区间 $n$ 次方和

看上去似乎普通的数据结构如线段树、平衡树等无法处理，需要一种巧妙复杂的数据结构。但出题人（[@lxl](https://www.zhihu.com/people/olddrivertree)）的题解中所实现的却是一种十分暴力的数据结构，后来称作珂朵莉树。

#### 适用条件

一般用于具有**区间赋值且数据随机**的题目。在随机数据的情况下，其时间复杂度可以达到 $O(n \log \log n)$ （[证明](https://zhuanlan.zhihu.com/p/102786071)）。

#### 算法实现

##### 初始化：

珂朵莉树以三元组 $<L,R,V>$ 的方式储存数据，表示区间 $[L,R]$ 中的数的值均为 $V$。

```c++
struct Node {
	int L,R;
	mutable int V;
	Node (int l,int r,int v) : L(l),R(r),V(v) {};//构造函数
	bool operator < (const Node &b) const {return L<b.L;}//重载小于运算符
};
```

注意 $V$ 的前缀 `mutable`，意为“可变的”，当整个结构体为const时，由它修饰的成员标仍然可以修改。

用 `set` 储存这些三元组：

```c++
set <Node> T;
```

这样，插入、查询、修改的时间就均为 $O(\log n)$ 啦。~~(当然，你也可以自己写以个平衡树QAQ)~~

##### 核心操作：

-  $\operatorname{Split}$

$\operatorname{Split}$ 操作是将一个区间分裂为两个区间：

```c++
#define Auto set <Node> :: iterator //如果支持c++11，可以直接使用auto
Auto Split(int Pos) {
	Auto it= T.lower_bound(Node(Pos,0,0));//找到第一个L不小于Pos的区间
	if(it!=T.end() && it->L==Pos) return it;//如果不需要Split，就直接返回
	--it;//找到Pos所在的区间
	int L=it->L,R=it->R,V=it->V;
	T.erase(it),T.insert(Node(L,Pos-1,V));
	return T.insert(Node(Pos,R,V)).first;
    //删除原区间，插入两个新分裂的区间，返回后插入的区间
    //这里利用了pair<iterator,bool> insert (const value_type& val)的返回值
}
```

- $\operatorname{Assign}$

**$\operatorname{Assign}$** 函数是珂朵莉树保证其复杂度的核心，即**区间赋值**函数：

```c++
void Assign(int L,int R,int V) {
	Auto itR=Split(R+1),itL=Split(L);
    //值得注意的是，此处顺序不能颠倒，否则可能RE
    //因为若先Split(L),那么Split(R)有可能使itL所指向的区间分裂,则删除itL~itR时会出错
	T.erase(itL,itR),T.insert(Node(L,R,V));//消除范围内的所有区间，再插入合并后的区间
}
```

由于数据随机，会有大量的**区间赋值**操作，这样会迅速的缩小 $\operatorname{set}$ 的大小，保证其复杂度。

##### 其他操作：~~(暴力大法好)~~

- 区间加法：

一个一个加 Σ(っ°Д°;)っ

```c++
void Add(int L,int R,int V) {
	Auto itR=Split(R+1),itL=Split(L);
	for(; itL!=itR; ++itL) itL->V+=V;
}
```

- 求区间第 $k$ 小值

暴力取出并排序 !!!∑(ﾟДﾟノ)ノ

 ```c++
int Rank(int L,int R,int K) {
	vector <pair<int,int> > Temp;
	Auto itR=Split(R+1),itL=Split(L);
	Temp.clear();
	for(; itL!=itR; ++itL) Temp.push_back(pair<ll,ll>(itL->V,itL->R-itL->L+1));
	sort(Temp.begin(),Temp.end());
	for(vector <pair<int,int> > :: iterator it=Temp.begin(); it!=Temp.end(); ++it) {
		K-=it->second;
		if(K<=0) return it->first;
	}
}
 ```

- 求区间 $n$ 次方和

暴力遍历并快速幂 (°Д°)

```c++
int Sum(int L,int R,int Ex,int Mod) {
	Auto itR=Split(R+1),itL=Split(L);
	int reg=0;
	for(; itL!=itR; ++itL) reg=(reg+(itL->R-itL->L+1)*Pow(itL->V,Ex,Mod))%Mod;
	return reg;
}
```

#### 例题

- [CF896C](https://www.luogu.com.cn/problem/CF896C)
- [CF915E](https://www.luogu.com.cn/problem/CF915E)

~~曾经有很多数据结构题可以用珂朵莉树水过，但被几个毒瘤([@noip](https://www.luogu.com.cn/user/3296) [@mrsrz](https://www.luogu.com.cn/user/6813) [@NaCly_Fish](https://www.luogu.com.cn/user/115864))给Hack了~~

#### 总结

珂朵莉树是**随机数据**下表现良好的数据结构，但在非随机数据下**极易被Hack**，因此一般情况下只作为骗分或对拍使用。

[发明者的blog](http://codeforces.com/blog/entry/56135)