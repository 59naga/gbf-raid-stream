gbf-raid-stream
---

![5587be1398a62e7ba9376b7e0b57bffa](https://user-images.githubusercontent.com/1548478/42772073-35ce6f50-8964-11e8-91d4-9a3b8d4b373d.gif)

小さい画面向け twitter救援リアルタイム検索

バグ報告・開発貢献
---

[New issue](https://github.com/59naga/gbf-raid-bosses/issues/new)から、日本語で投稿してください。再現方法、使用端末などを明記いただけたら、より対応が迅速に行えます。

## 開発貢献
[node-v10.6.0][0], [yarn-v1.8.0][1]環境下で開発します。

```bash
git clone git@github.com:59naga/gbf-raid-stream.git
cd gbf-raid-stream
yarn

yarn start
```

[ツイート解析サーバーは別プロジェクトして独立][4]しており、このプロジェクトは起動済みの[herokuapp][5]に依存して開発を進めます。
スタンドアロンで動作させる場合、[GBFR_KEYS][4]を用意して[gbf-raid-server#heroku][5]を参考にしてください。

### テスト

古く危うい手法ですが、`yarn start`でコンパイル結果を`localhost`上で確認し、それをそのままビルドしてリリースする、という形での開発になります。

karmaなどを使用したテストは現在考えていませんが、機能が増え、メンテナンスが困難になる前に、徐々に取り入れようと思っています。

### ビルド

`yarn build`でリリース用の難読化されたコードを`dist/main.js`として出力します。
出力されたファイルはブラウザ用に依存ファイルを全て含んだ独立したモジュールとなるため、[コード共有サイト][2]で動作させることができます。

#### TODO

[このツイートがバズって][3]しまったため、ユーザーのアクセス起点を`http://jsrun.it/59naga/gbf-raid-stream-v0.0.0`にして、リリースを考える必要があります。

機能追加でバージョンアップさせても上記urlと矛盾するため、リダイレクトさせるなどを検討中です。

> また、jsdoitに`dist/main.js`をコピペする作業が果てしなく重いです。数分掛かります

[0]: https://github.com/creationix/nvm#readme
[1]: https://github.com/yarnpkg/yarn#readme
[2]: http://jsdo.it/59naga/gbf-raid-stream-v0.0.0
[3]: https://twitter.com/horse_n_game/status/1017273129641525250
[4]: https://github.com/59naga/gbf-raid-server#readme
[5]: https://github.com/59naga/gbf-raid-server/tree/heroku
