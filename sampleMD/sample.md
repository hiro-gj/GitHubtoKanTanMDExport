# サンプルMarkDown

## 1. サブフォルダ(./image)の画像を表示
（いらすとや様より）
<img src="./image/computer_mob_programming.png" width=50% />

## 2. 直接アップロードした画像
（いらすとや様より）
<img width="910" height="910" alt="computer_tokui_boy" src="https://github.com/user-attachments/assets/1370f3b0-fd3e-463c-a32a-9f91ea6f27b3" />

## 3. 直接アップロードしたmp4ファイル
(HYBRID CREATIVE MOVIE サクラ様より)

https://github.com/user-attachments/assets/5e71546c-940f-440f-b2f6-55e9d5dc55aa


## 4. GitHub Alert 記法
> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.

---

## 5. かんたんMarkdownの記法 より転記

## 見出し
先頭に`# `をつけることによって見出しになります。見出しのレベルは`#`の数で表現します。

```
# 見出し1
## 見出し2
### 見出し3
#### 見出し4
##### 見出し5
###### 見出し6
```
# 見出し1
## 見出し2
### 見出し3
#### 見出し4
##### 見出し5
###### 見出し6



## 段落
空行を挟むことで段落となります。
```
段落1
(空行)
段落2
```

段落1

段落2



## 改行
改行の前に半角スペースを2つ記述することで改行されます。
```
hoge
fuga(スペース2つ)
piyo
```

hoge
fuga  
piyo


あるいはHTMLを使って改行することも可能です。

```html
hoge<br>
huga
```
hoge<br>
huga



## コード
バッククオート(` ` `)3つ、あるいはダッシュ`~`３つで囲むことで、コードを挿入できます。


~~~
```
print "hoge"
```
~~~

```
print "hoge"
```

Standardバージョン以上であれば、始まりのバッククオート、ダッシュの直後に言語名を記述することで、シンタックスハイライトします。


~~~
```python
print "hoge"
```
~~~
```python
print "hoge"
```



## インラインコード
バッククオートで単語を囲むとインラインコードなります。
```
2行目の`print`関数を見てください
```

2行目の`print`関数を見てください



## テキスト装飾
マークダウン記法、あるいはHTMLでテキストを装飾できます。
```
これは*イタリック*です  
これは**ボールド**です  
これは***イタリック＆ボールド***です  
これは~~打消し線~~です  
これは<sup>上付き</sup>です  
これは<sub>下付き</sub>です
```

これは*イタリック*です  
これは**ボールド**です  
これは***イタリック＆ボールド***です  
これは~~打消し線~~です  
これは<sup>上付き</sup>です  
これは<sub>下付き</sub>です



## リスト(箇条書き)
`* `, `+`あるいは`- `を先頭に記述することで箇条書きになります。ネストはタブで表現します。
```
* リスト1
* リスト2
	* リスト3
		* リスト4
```
* リスト1
* リスト2
	* リスト3
		* リスト4



## 番号付きリスト
`番号. `を先頭に記述することで番号付きのリストになります。ネストはタブで表現します。
番号は自動的に採番されるため、すべての行を`1. `と記述するのがお勧めです。

```
1. 番号付きリスト1
1. 番号付きリスト2
1. 番号付きリスト3
	1. 番号付きリスト4
		1. 番号付きリスト5
		1. 番号付きリスト6
	1. 番号付きリスト7
```
1. 番号付きリスト1
1. 番号付きリスト2
1. 番号付きリスト3
	1. 番号付きリスト4
		1. 番号付きリスト5
		1. 番号付きリスト6
	1. 番号付きリスト7



## 引用
`>`を先頭に記述することで引用となります。ネストは`>`を多重に記述します。

```
> 引用  
> 引用
>> 多重引用
```

> 引用  
> 引用
>> 多重引用



## 水平線(hr)
`-`や`_`を３つ以上並べると水平線に変換されます。

```
---
hoge
- - - - - - - -
fuga
_ _ _ _ _ _ _ _
piyo
<hr>
```
---
hoge
- - - - - - - -
fuga
_ _ _ _ _ _ _ _
piyo
<hr>



## リンク
`[リンク文字列](URL)`でリンクに変換されます。

```
[google](http://www.google.co.jp/)
```
[google](http://www.google.co.jp/)

リンク先を添付ファイルにすると、そのファイルをダウンロードするリンクを作ることができます。

```
[猫画像をDL](attach:cat.jpg)
```
[猫画像をDL](attach:cat.jpg)

## 外部参照リンク
以下のように、URLを外部に定義することもできます。URLが長くて読みづらくなる場合に有用です。
```
[yahoo japan][yahoo]
[yahoo]: http://www.yahoo.co.jp
```

[yahoo japan][yahoo]
[yahoo]: http://www.yahoo.co.jp



## 画像
添付画像は`<img src="attach:画像名">`で挿入できます。

```
<img src="attach:cat.jpg">
```

<img width="370" height="534" alt="cat" src="https://github.com/user-attachments/assets/eaa80b92-e9a5-4e0c-bc7d-a59e618c2555" />


通常のMarkdown記法でも挿入可能です。ただし、その場合は横幅などの属性指定はできません

```
![alt](画像URL)
```

（例省略）


## テーブル（表）
テーブルは以下のように記述します。

```
これは     | 一番
-----------| ------------
シンプルな | テーブルです
```

これは     | 一番
-----------| ------------
シンプルな | テーブルです


枠をつけても構いません。

```
|枠を   | つけても |
|-------|----------|
|意味は | 同じです |
```

|枠を   | つけても |
|-------|----------|
|意味は | 同じです |


`:`を使うと文字を揃えることができます。

```
| 左揃え | 中央揃え | 右揃え |
|:-------|:--------:|-------:|
|1       |2         |3       |
|4       |5         |6       |
```
| 左揃え | 中央揃え | 右揃え |
|:-------|:--------:|-------:|
|1       |2         |3       |
|4       |5         |6       |



## 注釈
Markdownには注釈の記法がありませんが、HTMLを使うことで注釈に近いことが実現可能です。

```
注釈のようなことを実現可能です<sup>[1](#note1)</sup>

<small id="note1">無理やりですが</small>
```


注釈のようなことを実現可能です<sup>[1](#note1)</sup>

<small id="note1">無理やりですが</small>



## info, warn, alert
`info`, `warn`そして`alert`クラスを用いることで青色、黄色、赤色の枠を使った表現が可能です。
（これはMarkdown記法ではなく、かんたんMarkdown独自の記法です。）

```
<p class="info">**ポイント** ちょっとした情報です。</p>
<p class="warn">**注意** 気をつけてください</p>
<p class="alert">**警告** 細心の注意を払ってください</p>
```
<p class="info">**ポイント** ちょっとした情報です。</p>
<p class="warn">**注意** 気をつけてください</p>
<p class="alert">**警告** 細心の注意を払ってください</p>



## シーケンス図（Fullエディションのみ）
`sequence`クラスを使うと、js-sequence-diagramsを利用してシーケンス図を記述することができます。

```
<div class="sequence">
Andrew->China: Says Hello
Note right of China: China thinks\nabout it
China-->Andrew: How are you?
Andrew->>China: I am good thanks!
</div>
```

<div class="sequence">
Andrew->China: Says Hello
Note right of China: China thinks\nabout it
China-->Andrew: How are you?
Andrew->>China: I am good thanks!
</div>

js-sequence-diagramsの記法は[公式ページ](https://bramp.github.io/js-sequence-diagrams/)をご覧ください。



## フローチャート（Fullエディションのみ）
`flow`クラスを使うとflowchart.jsを利用してフローチャートを記述することができます。

```
<div class="flow">
st=>start: Start:>http://www.google.com[blank]
e=>end:>http://www.google.com
op1=>operation: My Operation
sub1=>subroutine: My Subroutine
cond=>condition: Yes
or No?:>http://www.google.com
io=>inputoutput: catch something...

st->op1->cond
cond(yes)->io->e
cond(no)->sub1(right)->op1
</div>
```

<div class="flow">
st=>start: Start:>http://www.google.com[blank]
e=>end:>http://www.google.com
op1=>operation: My Operation
sub1=>subroutine: My Subroutine
cond=>condition: Yes
or No?:>http://www.google.com
io=>inputoutput: catch something...

st->op1->cond
cond(yes)->io->e
cond(no)->sub1(right)->op1
</div>


flowchart.jsの記法は[公式ページ](https://adrai.github.io/flowchart.js/)をご覧ください。
