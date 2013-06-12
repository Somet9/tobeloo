Tobeloo
=======
Tomblooの影響を強く受けるFirefoxアドオンのTumblrクライアントです。  
Tomblooの使い勝手はそのままに、Tumblrとの通信をAPIを通して行うようにすることを目的に  
開発しています。

名前の由来
----------
TomblooとTaberarelooへの感謝と尊敬の意を込めて、２つの名前を足しあわせて命名しました。  
以前はTombloaとしていましたが、Tomblooと勘違いされてしまわないよう、明確に別の名前にしました。

Tumblr以外は可能な限りプラグインで実装
--------------------------------------
基本的にはTumblr以外の機能はプラグインとして実装するように考えています。  
Twitterについても、OAuthのライブラリは本体搭載しているので、このライブラリをプラグイン側から使えるようにし、  
Twitterの通信処理のほとんどはプラグイン側で行います。  
このような仕様にすることで、何らかの形で問題が発生した場合、その問題の切り分けを容易に行えるようになります。
プラグイン方式を採用する欠点として、セキュリティ上の問題があります。
これは、プラグインでできることを増やすほど危険に晒されていますが、各ユーザーに注意して使ってもらうこととします。

ライセンスについて
------------------
The MIT License (MIT)

Copyright (c) 2013 rikuta0209

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

使用ライブラリ
--------------
### OAuth.js
Copyright 2008 Netflix, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0 "Apache License 2.0")

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
