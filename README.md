<img src="images/icon.svg" width="192" height="192">

# 한글 단어 찾기 게임

[https://git.d0p.dev](https://git.d0p.dev)

## Singleplayer

- [x] Restart game after solving the stage
- [ ] Add events for settings panel
- [ ] Seed-based board generation
  - [ ] Numbered stages(infinitely many)
- [ ] Speech API to speak out completed word
- [ ] Cheat prevention (browser find feature)
  - [ ] pointer position based tracking instead of using element hover state
- [ ] Time the stage completion
- [ ] Share API to share the result time

## 1v1 Multiplayer

- [ ] Same board config, separately finding in their own board
- [ ] If found a word, attack other player(penalty with length of word to remaining solving time)
- [ ] If found a word that the other player found recently, attack back with multiplier
- [ ] Solving in a combo (without long idle time between words) will give more power to attack