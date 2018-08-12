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

検討中(jestでいいかなって思ってる)

### ビルド

`npm run deploy`で`dist`以下ににコードを生成したのち、静的ファイルとして[now](https://qiita.com/nkzawa/items/8bf62549f79ebbcaafd8)にアップロードします。

[0]: https://github.com/creationix/nvm#readme
[1]: https://github.com/yarnpkg/yarn#readme
[2]: http://jsdo.it/59naga/gbf-raid-stream-v0.0.0
[3]: https://twitter.com/horse_n_game/status/1017273129641525250
[4]: https://github.com/59naga/gbf-raid-server#readme
[5]: https://github.com/59naga/gbf-raid-server/tree/heroku
