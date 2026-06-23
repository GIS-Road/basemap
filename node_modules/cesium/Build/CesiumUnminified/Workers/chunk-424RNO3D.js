/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.142.0
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

import {
  TerrainProvider_default
} from "./chunk-7WM2PX4V.js";
import {
  EllipsoidalOccluder_default,
  TerrainEncoding_default,
  VerticalExaggeration_default
} from "./chunk-VWV2IJRB.js";
import {
  WebMercatorProjection_default
} from "./chunk-4MGMYHOO.js";
import {
  OrientedBoundingBox_default
} from "./chunk-EPYXRCDB.js";
import {
  AttributeCompression_default
} from "./chunk-7J2HKPRH.js";
import {
  AxisAlignedBoundingBox_default
} from "./chunk-DDWSZVMY.js";
import {
  IntersectionTests_default,
  Ray_default
} from "./chunk-3VFEWOBI.js";
import {
  BoundingSphere_default,
  Interval_default
} from "./chunk-XZMBNNDX.js";
import {
  Event_default,
  Rectangle_default,
  Resource_default,
  Transforms_default,
  binarySearch_default,
  buildModuleUrl_default,
  isCrossOriginUrl_default,
  require_URI
} from "./chunk-MYP774IS.js";
import {
  Matrix4_default
} from "./chunk-Q3PY526V.js";
import {
  ComponentDatatype_default
} from "./chunk-P3CK7MCY.js";
import {
  RuntimeError_default
} from "./chunk-Y5BF6AFU.js";
import {
  Cartesian2_default,
  Cartographic_default,
  Ellipsoid_default,
  FeatureDetection_default
} from "./chunk-V7VQKN6N.js";
import {
  Cartesian3_default,
  Frozen_default,
  Matrix3_default
} from "./chunk-MPZHGZU6.js";
import {
  Math_default
} from "./chunk-J6BWOHUF.js";
import {
  Check_default,
  DeveloperError_default
} from "./chunk-AYKR4VBR.js";
import {
  __toESM,
  defined_default
} from "./chunk-ZP7JMQV4.js";

// node_modules/meshoptimizer/meshopt_encoder.js
var MeshoptEncoder = (function() {
  var wasm = "b9H79Tebbbe9ok9Geueu9Geub9Gbb9Gruuuuuuueu9Gvuuuuueu9Gduueu9Gluuuueu9Gvuuuuub9Gouuuuuub9Gluuuub9GiuuueuiE8AdilveoveovrrwrrrDDoDrbqqbelve9Weiiviebeoweuecj:Gdkr:PlCo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8F9TW79O9V9Wt9FW9U9J9V9KW9wWVtW949c919M9MWV9mW4W2be8A9TW79O9V9Wt9FW9U9J9V9KW9wWVtW949c919M9MWVbd8F9TW79O9V9Wt9FW9U9J9V9KW9wWVtW949c919M9MWV9c9V919U9KbiE9TW79O9V9Wt9FW9U9J9V9KW9wWVtW949wWV79P9V9UblY9TW79O9V9Wt9FW9U9J9V9KW69U9KW949c919M9MWVbv8E9TW79O9V9Wt9FW9U9J9V9KW69U9KW949c919M9MWV9c9V919U9Kbo8A9TW79O9V9Wt9FW9U9J9V9KW69U9KW949wWV79P9V9UbrE9TW79O9V9Wt9FW9U9J9V9KW69U9KW949tWG91W9U9JWbwa9TW79O9V9Wt9FW9U9J9V9KW69U9KW949tWG91W9U9JW9c9V919U9KbDL9TW79O9V9Wt9FW9U9J9V9KWS9P2tWV9p9JtbqK9TW79O9V9Wt9FW9U9J9V9KWS9P2tWV9r919HtbkL9TW79O9V9Wt9FW9U9J9V9KWS9P2tWVT949WbxY9TW79O9V9Wt9FW9U9J9V9KWS9P2tWVJ9V29VVbmE9TW79O9V9Wt9F9V9Wt9P9T9P96W9wWVtW94J9H9J9OWbza9TW79O9V9Wt9F9V9Wt9P9T9P96W9wWVtW94J9H9J9OW9ttV9P9WbHa9TW79O9V9Wt9F9V9Wt9P9T9P96W9wWVtW94SWt9J9O9sW9T9H9WbOK9TW79O9V9Wt9F79W9Ht9P9H29t9VVt9sW9T9H9WbAl79IV9RbXDwebcekdKYq:8f8Adbk;wadhud9:8Jjjjjbc;qw9Rgr8KjjjjbcbhwdnaeTmbabcbyd;i:I:cjbaoaocb9iEgDc:GeV86bbarc;adfcbcjdz:xjjjb8AdnaiTmbarc;adfadalz:wjjjb8Akarc;abfalfcbcbcjdal9RalcFe0Ez:xjjjb8Aarc;abfarc;adfalz:wjjjb8Aar9cb83iUar9cb83i8War9cb83iyar9cb83iaar9cb83iKar9cb83izar9cb83iwar9cb83ibcj;abal9Uc;WFbGcjdalca0Ehqdnaicd6mbavcd9imbaDTmbadcefhkaqci2gxal2hmarc;alfclfhParc;qlfceVhsarc;qofclVhzcbhHincdhOcbhAdnavci6mbar9cb83i;Ooar9cb83i;Goar9cb83i;yoar9cb83i;qoadaHfgoybbhCcbhXincbhwcbhQdninaoalfhLaoybbgKaC7aQVhQawcP0meaLhoaKhCawcefgwaXfai6mbkkcbhCarc;qofhwincwhYcwh8AdnaQaC93gocFeGgEcs0mbclh8AaEci0mbcdcbaEEh8Akdnaocw4cFeGgEcs0mbclhYaEci0mbcdcbaEEhYkaYa8AfhEawydbh3cwhYcwh8Adnaocz4cFeGg5cs0mbclh8Aa5ci0mbcdcba5Eh8AkaEa3fhEdnaocFFFFb0mbclhYaocFFF8F0mbcbcdaocjjjw6EhYkawaEa8AfaYfBdbawclfhwaCcefgCcw9hmbkaLhoaKhCaXczfgXai6mbkcbhocehwazhQinawaoaQydbarc;qofaocdtfydb6EhoaQclfhQawcefgwcw9hmbkaoclthAcihOkcbhEarc;qlfcbcjdz:xjjjb8AarcbBd;ilar9cb83i;aladh8Eaqh8Fakh3inarc;qlfadaEaEcb9h9Ral2falz:wjjjb8Aaia8Faia8F6EhadnaqaiaE9RaEaqfai6EgKcsfc9WGgoaK9nmbarc;qofaKfcbaoaK9Rz:xjjjb8AkadaEal2fhhcbhginagaAVcl4hXarc;alfagcdtfh8JaHh8Kcbh8Lina8LaHfhwdndndndndndndnagPlbedibkaKTmvahawfhoarc;qlfawfRbbhQarc;qofhwaahCinawaoRbbgYaQ9RgQcetaQcKtc8F91786bbawcefhwaoalfhoaYhQaEaCcufgC9hmbxvkkaKTmla8Kc9:Ghoa8LcitcwGh8Aarc;qlfawceVfRbbcwtarc;qlfawc9:GfRbbVhQarc;qofhwaahCinawa3aofRbbcwta8EaofRbbVgYaQ9RgQcetaQcztc8F917cFFiGa8A486bbaoalfhoawcefhwaYhQaEaCcufgC9hmbxlkkasa8Kc98GgQfhoa3aQfhYarc;qlfawc98GgQfRbbhCcwhwinaoRbbawtaCVhCaocefhoawcwfgwca9hmbxdkkaKTmdxekaKTmea8Lcith5ahaQfh8AcbhLina8ARbbhQcwhoaYhwinawRbbaotaQVhQawcefhwaocwfgoca9hmbkarc;qofaLfaQaC7aX93a5486bbaYalfhYa8Aalfh8AaQhCaLcefgLaK9hmbkka8Jydbh8AcbhLarc;qofhoincdhQcbhwinaQaoawfRbbcb9hfhQawcefgwcz9hmbkclhCcbhwinaCaoawfRbbcd0fhCawcefgwcz9hmbkcwhYcbhwinaYaoawfRbbcP0fhYawcefgwcz9hmbkaQaCaQaC6EgwaYawaY6Egwczawcz6Ea8Afh8AaoczfhoaLczfgLaK6mbka8Ja8ABdbka8Kcefh8Ka8Lcefg8Lcl9hmbkagcefggaO9hmbka8Eamfh8Ea8Faxfh8Fa3amfh3aEaxfgEai6mbkcbhocehwaPhQinawaoaQydbarc;alfaocdtfydb6EhoaQclfhQaOawcefgw9hmbkaraHcd4faAcdVaoaocdSE86bbaHclfgHal6mbkkabaefhgabcefhoalcd4g8McbaDEhkadcefh8Narc;abfceVhecbhmdndninaiam9nmearc;qofcbcjdz:xjjjb8Aagao9Rak6mdadamal2gwfhxcbhHa8Nawfhzaocbakz:xjjjbg8Fakfh3aqaiam9Ramaqfai6Egscsfgocl4cifcd4hOaoc9WGg8JThPindndndndndndndndndndnaDTmbaraHcd4fRbbgQciGPlbedlbkasTmdaxaHfhoarc;abfaHfRbbhQarc;qofhwashCinawaoRbbgYaQ9RgQcetaQcKtc8F91786bbawcefhwaoalfhoaYhQaCcufgCmbxikkasTmiaHcitcwGh8Aarc;abfaHceVfRbbcwtarc;abfaHc9:GgofRbbVhQaxaofhoarc;qofhwashCinawao8VbbgYaQ9RgQcetaQcztc8F917cFFiGa8A486bbawcefhwaoalfhoaYhQaCcufgCmbxikkaeaHc98Gg8Afhoaza8AfhYarc;abfa8AfRbbhCcwhwinaoRbbawtaCVhCaocefhoawcwfgwca9hmbkasTmdaQcl4hKaHcitcKGhEaxa8Afh8AcbhLina8ARbbhQcwhoaYhwinawRbbaotaQVhQawcefhwaocwfgoca9hmbkarc;qofaLfaQaC7aK93aE486bbaYalfhYa8Aalfh8AaQhCaLcefgLas9hmbkkaDmbcbhoxlka8JTmbcbhodninarc;qofaofgwcwf8Pibaw8Pib:e9qTmeaoczfgoa8J9pmdxbkkdnavmbcehoxikcbh8AaOhLaOhKinarc;qofa8Afgocwf8Pibhyao8Pibh8PcdhQcbhwinaQaoawfRbbcb9hfhQawcefgwcz9hmbkclhCcbhwinaCaoawfRbbcd0fhCawcefgwcz9hmbkcwhYcbhwinaYaoawfRbbcP0fhYawcefgwcz9hmbkaQaCaQaC6EgoaYaoaY6Egoczaocz6EaKfhKaocucbaya8P:e9cb9sEgwaoaw6EaLfhLa8Aczfg8Aa8J9pmdxbkka8FaHcd4fgoaoRbbcdaHcetcoGtV86bbxikdnaLas6mbaKas6mba8FaHcd4fgoaoRbbciaHcetcoGtV86bbaga39Ras6mra3arc;qofasz:wjjjbasfh3xikaLaK9phoka8FaHcd4fgwawRbbaoaHcetcoGtV86bbkaga39RaO6mla3cbaOz:xjjjbgaaOfhKdndna8JmbaPhoxekdnagaK9RcK9pmbaPhoxekaocdtc:q:G:cjbfcj:G:cjbaDEg3ydxghcetc;:FFFeGhAcuhEcuahtcu7cFeGh8Ecbh8Karc;qofhQinarc;qofa8KfhXczh8AdndndnahPDbeeeeeeedekcucbaXcwf8PibaX8Pib:e9cb9sEh8AxekcbhoaAh8Aina8Aa8EaQaofRbb9nfh8Aaocefgocz9hmbkkcih5cbhYinczhwdndndna3aYcdtfydbgLPDbeeeeeeedekcucbaXcwf8PibaX8Pib:e9cb9sEhwxekaLcetc;:FFFeGhwcuaLtcu7cFeGhCcbhoinawaCaQaofRbb9nfhwaocefgocz9hmbkkdndnawa8A6mbaLaE9hmeawa8A9hmea3a5cdtfydbcwSmekaYh5awh8AkaYcefgYci9hmbkaaa8Kco4fgoaoRbba5a8Kci4coGtV86bbdndndna3a5cdtfydbgEPDdbbbbbbbebkdncwaE9Tg5TmbcuaEtcu7hwdndnaEceSmbcbh8LaQhXinaXhoa5hYcbhCinaoRbbg8AawcFeGgLa8AaL6EaCaEtVhCaocefhoaYcufgYmbkaKaC86bbaXa5fhXaKcefhKa8La5fg8Lcz6mbxdkkcbh8LaQhXinaXhoa5hYcbhCinaoRbbg8AawcFeGgLa8AaL6EaCcetVhCaocefhoaYcufgYmbkaKaC:T9cFe:d9c:c:qj:bw9:9c:q;c1:I1e:d9c:b:c:e1z9:9ca188bbaXa5fhXaKcefhKa8La5fg8Lcz6mbkkcbhoinaKaQaofRbbgC86bbaKaCawcFeG9pfhKaocefgocz9hmbxikkdnaEceSmbinaKcb86bbaKcefhKxbkkinaKcb86bbaKcefhKxbkkaKaX8Pbw83bwaKaX8Pbb83bbaKczfhKka8Kczfg8Ka8J9pgomeaQczfhQagaK9RcK9pmbkkaoTmlaKh3aKTmlkaHcefgHal9hmbkarc;abfaxascufal2falz:wjjjb8Aasamfhma3hoa3mbkcbhwxdkdnagao9RakalfgwcKcaaDEgQawaQ0EgC9pmbcbhwxdkdnawaQ9pmbaocbaCaw9Rgwz:xjjjbawfhokaoarc;adfalz:wjjjbalfhodnaDTmbaoara8Mz:wjjjba8Mfhokaoab9Rhwxekcbhwkarc;qwf8Kjjjjbawk5babaeadaialcdcbyd;i:I:cjbz:bjjjbk9reduaecd4gdaefgicaaica0Eabcj;abae9Uc;WFbGcjdaeca0Egifcufai9Uae2aiadfaicl4cifcd4f2fcefkmbcbabBd;i:I:cjbk;HPeLu8Jjjjjbc;ae9Rgl8Kjjjjbcbhvdnaeaici9UgocHf6mbabcbyd;m:I:cjbgrc;GeV86bbalc;abfcFecjez:xjjjb8Aal9cu83iUal9cu83i8Wal9cu83iyal9cu83iaal9cu83iKal9cu83izal9cu83iwal9cu83ibabaefc9WfhwabcefgDaofhednaiTmbcmcsarcb9kgqEhkcbhxcbhmcbhPcbhscbhzindnaeaw9nmbcbhvxikazcufhvadaPcdtfgHydbhOaHcwfydbhAaHclfydbhCcbhXdndndninalc;abfavcsGcitfgoydlhQdndndnaoydbgoaO9hmbaQaCSmekdnaoaC9hmbaQaA9hmbaXcefhXxekaoaA9hmeaQaO9hmeaXcdfhXkaXc870mdascufhvaHaXcdtgAcxGgoyd:4:G:cjbcdtfydbhQaHaoyd:0:G:cjbcdtfydbhCaHaoyd:W:G:cjbcdtfydbhOcbhodnindnalavcsGcdtfydbaQ9hmbaohXxdkcuhXavcufhvaocefgocz9hmbkkaxaQaxSgvaXce9iaXak9oVgoGfhxdndndncbcsavEaXaoEgvcs9hmbarce9imbaQaQamaQcefamSgvEgmcefSmecmcsavEhvkaDavaAc;WeGV86bbavcs9hmeaQam9Rgvcetavc8F917hvinaecbcjeavcje6EavcFbGV86bbaecefheavcr4gvmbkaQhmxvkcPhvaDaAcPV86bbaQhmkavTmiavak9omicdhocehXazhAxlkavcufhvaXclfgXc;ab9hmbkkdnaHcecdcbaAaxSEaCaxSEcdtgvyd:W:G:cjbcdtfydbgOTaHavyd:0:G:cjbcdtfydbgCceSGaHavyd:4:G:cjbcdtfydbgQcdSGaxcb9hGaqGgLce9hmbal9cu83iUal9cu83i8Wal9cu83iyal9cu83iaal9cu83iKal9cu83izal9cu83iwal9cu83ibcbhxkcbhXascufgvhodnindnalaocsGcdtfydbaC9hmbaXhAxdkcuhAaocufhoaXcefgXcz9hmbkkcbhodnindnalavcsGcdtfydbaQ9hmbaohXxdkcuhXavcufhvaocefgocz9hmbkkaxaOaxSgKfhHdndnaAcm0mbaAcefhAxekcbcsaCaHSgvEhAaHavfhHkdndnaXcm0mbaXcefhXxekcbcsaQaHSgvEhXaHavfhHkc9:cuaKEhYcbhvaXaAcltVg8AcFeGhodndndninavc;q:G:cjbfRbbaoSmeavcefgvcz9hmbxdkkaLaOax9havcm0VVmbaDavc;WeV86bbxekaDaY86bbaea8A86bbaecefhekdnaKmbaOam9Rgvcetavc8F917hvinaecbcjeavcje6EavcFbGV86bbaecefheavcr4gvmbkaOhmkdnaAcs9hmbaCam9Rgvcetavc8F917hvinaecbcjeavcje6EavcFbGV86bbaecefheavcr4gvmbkaChmkdnaXcs9hmbaQam9Rgvcetavc8F917hvinaecbcjeavcje6EavcFbGV86bbaecefheavcr4gvmbkaQhmkalascdtfaOBdbascefcsGhvdndnaAPzbeeeeeeeeeeeeeebekalavcdtfaCBdbascdfcsGhvkdndnaXPzbeeeeeeeeeeeeeebekalavcdtfaQBdbavcefcsGhvkcihoalc;abfazcitfgXaOBdlaXaCBdbazcefcsGhAcdhXavhsaHhxxekcdhoalascdtfaQBdbcehXascefcsGhsazhAkalc;abfaAcitfgvaCBdlavaQBdbalc;abfazaXfcsGcitfgvaQBdlavaOBdbaDcefhDazaofcsGhzaPcifgPai6mbkkdnaeaw9nmbcbhvxekcbhvinaeavfavc;q:G:cjbfRbb86bbavcefgvcz9hmbkaeab9Ravfhvkalc;aef8KjjjjbavkZeeucbhddninadcefgdc8F0meaeceadt0mbkkadcrfcFeGcr9Uci2cdfabci9U2cHfkmbcbabBd;m:I:cjbk:zderu8Jjjjjbcz9Rhlcbhvdnaeaicvf6mbabcbRb;m:I:cjbc;qeV86bbal9cb83iwabcefhvabaefc98fhodnaiTmbcbhecbhrcbhwindnavao6mbcbskadawcdtfydbgDalcwfaraDae9Rgeaec8F91ge7ae9Rc507grcdtfgqydb9Rgec8E91c9:Gaecdt7arVheinavcbcjeaecje6EaecFbGV86bbavcefhvaecr4gembkaqaDBdbaDheawcefgwai9hmbkkdnavao9nmbcbskavcbBbbavab9RclfhvkavkBeeucbhddninadcefgdc8F0meaeceadt0mbkkabadcwfcFeGcr9U2cvfk:dvli99dui99ludnaeTmbcuadcetcuftcu7:Zhvdndncuaicuftcu7:ZgoJbbbZMgr:lJbbb9p9DTmbar:Ohwxekcjjjj94hwkcbhicbhDinalclfIdbgrJbbbbJbbjZalIdbgq:lar:lMalcwfIdbgk:lMgr:varJbbbb9BEgrNhxaqarNhralcxfIdbhqdndnakJbbbb9GTmbaxhkxekJbbjZar:l:tgkak:maxJbbbb9GEhkJbbjZax:l:tgxax:marJbbbb9GEhrkdndnaqJbbj:;aqJbbj:;9GEgxJbbjZaxJbbjZ9FEavNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohmxekcjjjj94hmkdndnakJbbj:;akJbbj:;9GEgqJbbjZaqJbbjZ9FEaoNJbbbZJbbb:;akJbbbb9GEMgq:lJbbb9p9DTmbaq:OhPxekcjjjj94hPkdndnarJbbj:;arJbbj:;9GEgqJbbjZaqJbbjZ9FEaoNJbbbZJbbb:;arJbbbb9GEMgr:lJbbb9p9DTmbar:Ohsxekcjjjj94hskdndnadcl9hmbabaDfgzas86bbazcifam86bbazcdfaw86bbazcefaP86bbxekabaifgzas87ebazcofam87ebazclfaw87ebazcdfaP87ebkaicwfhiaDclfhDalczfhlaecufgembkkk;hlld99eud99eudnaeTmbdndncuaicuftcu7:ZgvJbbbZMgo:lJbbb9p9DTmbao:Ohixekcjjjj94hikaic;8FiGhrinabcofcicdalclfIdb:lalIdb:l9EgialcwfIdb:lalaicdtfIdb:l9EEgialcxfIdb:lalaicdtfIdb:l9EEgiarV87ebdndnJbbj:;JbbjZalaicdtfIdbJbbbb9DEgoalaicd7cdtfIdbJ;Zl:1ZNNgwJbbj:;awJbbj:;9GEgDJbbjZaDJbbjZ9FEavNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohqxekcjjjj94hqkabcdfaq87ebdndnalaicefciGcdtfIdbJ;Zl:1ZNaoNgwJbbj:;awJbbj:;9GEgDJbbjZaDJbbjZ9FEavNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohqxekcjjjj94hqkabaq87ebdndnaoalaicufciGcdtfIdbJ;Zl:1ZNNgoJbbj:;aoJbbj:;9GEgwJbbjZawJbbjZ9FEavNJbbbZJbbb:;aoJbbbb9GEMgo:lJbbb9p9DTmbao:Ohixekcjjjj94hikabclfai87ebabcwfhbalczfhlaecufgembkkk;Pviwue99eu8Jjjjjbcjd9Rgo8Kjjjjbadcd4hrdndndnavcd9hmbarTmbaohdarhwinadc:CuBdbadclfhdawcufgwmbkaeTmdarcdthDalhqcbhkinaohdaqhwarhxinadadydbgmcbawIdbgP:8cL4cFeGc:cufaPJbbbb9BEgsamas9kEBdbawclfhwadclfhdaxcufgxmbkaqaDfhqakcefgkae9hmbxdkkaeTmekarcdthqavce9hhDcbhkindndndnaDmbarTmdc:CuhwalhdarhxinawcbadIdbgP:8cL4cFeGc:cufaPJbbbb9BEgmawam9kEhwadclfhdaxcufgxmbxdkkdndndndnavPleddbdkarTmlaohdalhwarhxinadcbcbawIdbgP:8cL4cFeGgmc:cufgsasam0EaPJbbbb9BEBdbadclfhdawclfhwaxcufgxmbxikkarTmicbhdarhwinaoadfcbaladfIdbgP:8cL4cFeGgxc8Aaxc8A0Ec:cufaPJbbbb9BEBdbadclfhdawcufgwmbxdkkarTmdkc:CuhwkcbhdarhminawhxdnavceSmbaoadfydbhxkdndnaladfIdbgPcjjj;8iaxai9RcefgxcLt9R::NJbbbZJbbb:;aPJbbbb9GEMgP:lJbbb9p9DTmbaP:Ohsxekcjjjj94hskabadfascFFFrGaxcKtVBdbadclfhdamcufgmmbkkabaqfhbalaqfhlakcefgkae9hmbkkaocjdf8Kjjjjbk:Olveue99iue99iudnaeTmbceaicufthvcuaitcu7:Zhocbhradcl9hhwcbhDindndnalcwfIdbgqJbbbbaqJbbbb9GEgqJbbjZaqJbbjZ9FEaoNJbbbZMgq:lJbbb9p9DTmbaq:Ohixekcjjjj94hikdndnalIdbgqJbbbbaqJbbbb9GEgqJbbjZaqJbbjZ9FEaoNJbbbZMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkadai9Rcd9TgkaifhidndnalclfIdbgqJbbbbaqJbbbb9GEgqJbbjZaqJbbjZ9FEaoNJbbbZMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkadai9Rcd9ThddndnalcxfIdbgqJbbbbaqJbbbb9GEgqJbbjZaqJbbjZ9FEaoNJbbbZMgq:lJbbb9p9DTmbaq:Ohxxekcjjjj94hxkadaifhiaxce91avVhxdndnawmbabaDfgmai86bbamcifax86bbamcdfad86bbamcefak86bbxekabarfgmai87ebamcofax87ebamclfad87ebamcdfak87ebkarcwfhraDclfhDalczfhlaecufgembkkk;mqdQui998Jjjjjbc:qd9Rgv8Kjjjjbavc:Sefcbc;Kbz:xjjjb8AdnadTmbaiTmbdndnabaeSmbaehoxekavcuadcdtgradcFFFFi0Ecbyd;q:I:cjbHjjjjbbgoBd:SeavceBd:mdaoaearz:wjjjb8AkavcbBd:Oeav9cb83i:Geavc:Gefaoadaiavc:Sefz:pjjjbavyd:Gehwadci9UgDcbyd;q:I:cjbHjjjjbbheavc:Sefavyd:mdgqcdtfaeBdbavaqcefgrBd:mdaecbaDz:xjjjbhkavc:SefarcdtfcuaicdtaicFFFFi0Ecbyd;q:I:cjbHjjjjbbgxBdbavaqcdfgmBd:mdalc;ebfhPawheaxhrinaralIdbaPaeydbgscwascw6EcdtfIdbMUdbaeclfhearclfhraicufgimbkavc:SefamcdtfcuaDcdtadcFFFF970Ecbyd;q:I:cjbHjjjjbbgmBdbdnadci6mbaoheamhraDhiinaraxaeydbcdtfIdbaxaeclfydbcdtfIdbMaxaecwfydbcdtfIdbMUdbaecxfhearclfhraicufgimbkkaqcifhzalc;ebfhHavc;qbfhOavheavyd:KehAavyd:OehCcbhscbhrcbhXcehQinaehLaoarcx2fgKydbhPaKclfydbhdabaXcx2fgecwfaKcwfydbgYBdbaeclfadBdbaeaPBdbakarfce86bbaOaYBdwaOadBdlaOaPBdbamarcdtfcbBdbcih8AdnasTmbaLhiinaOa8AcdtfaiydbgeBdba8AaeaY9haeaP9haead9hGGfh8AaiclfhiascufgsmbkkaXcefhXcbhsinaCaAaKascdtfydbcdtgifydbcdtfgYheawaifgdydbgPhidnaPTmbdninaeydbarSmeaeclfheaicufgiTmdxbkkaeaYaPcdtfc98fydbBdbadadydbcufBdbkascefgsci9hmbkdndndna8ATmbcuhrJbbbbhEcbhdavyd:KehYavyd:OehKindnawaOadcdtfydbcdtgsfydbgeTmbaxasfgiIdbh3aialcuadadcs0EcdtfclfIdbaHaecwaecw6EcdtfIdbMg5Udba5a3:th5aecdthiaKaYasfydbcdtfheinamaeydbgscdtfgPa5aPIdbMg3Udba3aEaEa39DgPEhEasaraPEhraeclfheaic98fgimbkkadcefgda8A9hmbkarcu9hmekaQaD9pmeindnakaQfRbbmbaQhrxdkaDaQcefgQ9hmbxdkka8Acza8Acz6EhsaOheaLhOarcu9hmekkazTmbaqcdtavc:Seffcwfheinaeydbcbyd;u:I:cjbH:bjjjbbaec98fheazcufgzmbkkavc:qdf8Kjjjjbk:0leoucuaicdtgvaicFFFFi0Egocbyd;q:I:cjbHjjjjbbhralalyd9GgwcdtfarBdbalawcefBd9GabarBdbaocbyd;q:I:cjbHjjjjbbhralalyd9GgocdtfarBdbalaocefBd9GabarBdlcuadcdtadcFFFFi0Ecbyd;q:I:cjbHjjjjbbhralalyd9GgocdtfarBdbalaocefBd9GabarBdwabydbcbavz:xjjjb8AabydbhraehladhvinaralydbcdtfgoaoydbcefBdbalclfhlavcufgvmbkcbhvabydlglhoarhwaihDinaoavBdbaoclfhoawydbavfhvawclfhwaDcufgDmbkadci9Uhqdnadcd9nmbabydwhocbhvinaecwfydbhwaeclfydbhDalaeydbcdtfgbabydbgbcefBdbaoabcdtfavBdbalaDcdtfgDaDydbgDcefBdbaoaDcdtfavBdbalawcdtfgwawydbgwcefBdbaoawcdtfavBdbaecxfheaqavcefgv9hmbkkinalalydbarydb9RBdbarclfhralclfhlaicufgimbkkQbabaeadaic;G:G:cjbz:ojjjbkQbabaeadaic;i:H:cjbz:ojjjbk9DeeuabcFeaicdtz:xjjjbhlcbhbdnadTmbindnalaeydbcdtfgiydbcu9hmbaiabBdbabcefhbkaeclfheadcufgdmbkkabk:3vioud9:du8Jjjjjbc;Wa9Rgl8Kjjjjbcbhvalcxfcbc;Kbz:xjjjb8AalcuadcitgoadcFFFFe0Ecbyd;q:I:cjbHjjjjbbgrBdxalceBd2araeadaicezNjjjbalcuaoadcjjjjoGEcbyd;q:I:cjbHjjjjbbgwBdzadcdthednadTmbabhiinaiavBdbaiclfhiadavcefgv9hmbkkawaefhDalabBdwalawBdl9cbhqindnadTmbaq9cq9:hkarhvaDhiadheinaiav8Pibak1:NcFrG87ebavcwfhvaicdfhiaecufgembkkalclfaq:NceGcdtfydbhxalclfaq9ce98gq:NceGcdtfydbhmalc;Wbfcbcjaz:xjjjb8AaDhvadhidnadTmbinalc;Wbfav8VebcdtfgeaeydbcefBdbavcdfhvaicufgimbkkcbhvcbhiinalc;WbfavfgeydbhoaeaiBdbaoaifhiavclfgvcja9hmbkadhvdndnadTmbinalc;WbfaDamydbgicetf8VebcdtfgeaeydbgecefBdbaxaecdtfaiBdbamclfhmavcufgvmbkaq9cv9smdcbhvinabawydbcdtfavBdbawclfhwadavcefgv9hmbxdkkaq9cv9smekkcwhvcbhiinalcxfavfc98fydbcbyd;u:I:cjbH:bjjjbbaiceGheclhvcehiaeTmbkalc;Waf8Kjjjjbk:Awliuo99iud9:cbhv8Jjjjjbca9Rgocbyd:4:I:cjbBdKaocb8Pd:W:I:cjb83izaocbyd;e:I:cjbBdwaocb8Pd:8:I:cjb83ibaicd4hrdndnadmbJFFuFhwJFFuuhDJFFuuhqJFFuFhkJFFuuhxJFFuFhmxekarcdthPaehsincbhiinaoczfaifgzasaifIdbgwazIdbgDaDaw9EEUdbaoaifgzawazIdbgDaDaw9DEUdbaiclfgicx9hmbkasaPfhsavcefgvad9hmbkaoIdKhDaoIdwhwaoIdChqaoIdlhkaoIdzhxaoIdbhmkdnadTmbJbbbbJbFu9hJbbbbamax:tgmamJbbbb9DEgmakaq:tgkakam9DEgkawaD:tgwawak9DEgw:vawJbbbb9BEhwdnalmbarcdthoindndnaeclfIdbaq:tawNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikai:S9cC:ghHdndnaeIdbax:tawNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikaHai:S:ehHdndnaecwfIdbaD:tawNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikabaHai:T9cy:g:e83ibaeaofheabcwfhbadcufgdmbxdkkarcdthoindndnaeIdbax:tawNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikai:SgH9ca:gaH9cz:g9cjjj;4s:d:eaH9cFe:d:e9cF:bj;4:pj;ar:d9c:bd9:9c:p;G:d;4j:E;ar:d9cH9:9c;d;H:W:y:m:g;d;Hb:d9cv9:9c;j:KM;j:KM;j:Kd:dhOdndnaeclfIdbaq:tawNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikai:SgH9ca:gaH9cz:g9cjjj;4s:d:eaH9cFe:d:e9cF:bj;4:pj;ar:d9c:bd9:9c:p;G:d;4j:E;ar:d9cH9:9c;d;H:W:y:m:g;d;Hb:d9cq9:9cM;j:KM;j:KM;jl:daO:ehOdndnaecwfIdbaD:tawNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikabaOai:SgH9ca:gaH9cz:g9cjjj;4s:d:eaH9cFe:d:e9cF:bj;4:pj;ar:d9c:bd9:9c:p;G:d;4j:E;ar:d9cH9:9c;d;H:W:y:m:g;d;Hb:d9cC9:9c:KM;j:KM;j:KMD:d:e83ibaeaofheabcwfhbadcufgdmbkkk9teiucbcbyd;y:I:cjbgeabcifc98GfgbBd;y:I:cjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaeczfheaiczfhiadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabk9teiucbcbyd;y:I:cjbgeabcrfc94GfgbBd;y:I:cjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikTeeucbabcbyd;y:I:cjbge9Rcifc98GaefgbBd;y:I:cjbdnabZbcztge9nmbabae9RcFFifcz4nb8Akkk;Sddbcj:Gdk;idbbbbdbbblbbbwbbbbbbbebbbdbbblbbbwbbbbbbbbbbbbbbbbbbbebbbdbbbbbbbebbbbbbbbbbbbbbbb4:h9w9N94:P:gW:j9O:ye9Pbbbbbb:l29hZ;69:9kZ;N;76Z;rg97Z;z;o9xZ8J;B85Z;:;u9yZ;b;k9HZ:2;Z9DZ9e:l9mZ59A8KZ:r;T3Z:A:zYZ79OHZ;j4::8::Y:D9V8:bbbb9s:49:Z8R:hBZ9M9M;M8:L;z;o8:;8:PG89q;x:J878R:hQ8::M:B;e87bbbbbbjZbbjZbbjZ:E;V;N8::Y:DsZ9i;H;68:xd;R8:;h0838:;W:NoZbbbb:WV9O8:uf888:9i;H;68:9c9G;L89;n;m9m89;D8Ko8:bbbbf:8tZ9m836ZS:2AZL;zPZZ818EZ9e:lxZ;U98F8:819E;68:FFuuFFuuFFuuFFuFFFuFFFuFbc;i:IdkCebbbebbbebbbdbbb9G:rbb";
  var wasmpack = new Uint8Array([
    32,
    0,
    65,
    2,
    1,
    106,
    34,
    33,
    3,
    128,
    11,
    4,
    13,
    64,
    6,
    253,
    10,
    7,
    15,
    116,
    127,
    5,
    8,
    12,
    40,
    16,
    19,
    54,
    20,
    9,
    27,
    255,
    113,
    17,
    42,
    67,
    24,
    23,
    146,
    148,
    18,
    14,
    22,
    45,
    70,
    69,
    56,
    114,
    101,
    21,
    25,
    63,
    75,
    136,
    108,
    28,
    118,
    29,
    73,
    115
  ]);
  if (typeof WebAssembly !== "object") {
    return {
      supported: false
    };
  }
  var instance;
  var ready = WebAssembly.instantiate(unpack(wasm), {}).then(function(result) {
    instance = result.instance;
    instance.exports.__wasm_call_ctors();
    instance.exports.meshopt_encodeVertexVersion(1);
    instance.exports.meshopt_encodeIndexVersion(1);
  });
  function unpack(data) {
    var result = new Uint8Array(data.length);
    for (var i = 0; i < data.length; ++i) {
      var ch = data.charCodeAt(i);
      result[i] = ch > 96 ? ch - 97 : ch > 64 ? ch - 39 : ch + 4;
    }
    var write = 0;
    for (var i = 0; i < data.length; ++i) {
      result[write++] = result[i] < 60 ? wasmpack[result[i]] : (result[i] - 60) * 64 + result[++i];
    }
    return result.buffer.slice(0, write);
  }
  function assert(cond) {
    if (!cond) {
      throw new Error("Assertion failed");
    }
  }
  function bytes(view) {
    return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
  }
  function reorder(fun, indices, vertices, optf) {
    var sbrk = instance.exports.sbrk;
    var ip = sbrk(indices.length * 4);
    var rp = sbrk(vertices * 4);
    var heap = new Uint8Array(instance.exports.memory.buffer);
    var indices8 = bytes(indices);
    heap.set(indices8, ip);
    if (optf) {
      optf(ip, ip, indices.length, vertices);
    }
    var unique = fun(rp, ip, indices.length, vertices);
    heap = new Uint8Array(instance.exports.memory.buffer);
    var remap = new Uint32Array(vertices);
    new Uint8Array(remap.buffer).set(heap.subarray(rp, rp + vertices * 4));
    indices8.set(heap.subarray(ip, ip + indices.length * 4));
    sbrk(ip - sbrk(0));
    for (var i = 0; i < indices.length; ++i) indices[i] = remap[indices[i]];
    return [remap, unique];
  }
  function spatialsort(fun, positions, count, stride) {
    var sbrk = instance.exports.sbrk;
    var ip = sbrk(count * 4);
    var sp = sbrk(count * stride);
    var heap = new Uint8Array(instance.exports.memory.buffer);
    heap.set(bytes(positions), sp);
    fun(ip, sp, count, stride);
    heap = new Uint8Array(instance.exports.memory.buffer);
    var remap = new Uint32Array(count);
    new Uint8Array(remap.buffer).set(heap.subarray(ip, ip + count * 4));
    sbrk(ip - sbrk(0));
    return remap;
  }
  function encode(fun, bound, source, count, size, level, version) {
    var sbrk = instance.exports.sbrk;
    var tp = sbrk(bound);
    var sp = sbrk(count * size);
    var heap = new Uint8Array(instance.exports.memory.buffer);
    heap.set(bytes(source), sp);
    var res = fun(tp, bound, sp, count, size, level, version);
    var target = new Uint8Array(res);
    target.set(heap.subarray(tp, tp + res));
    sbrk(tp - sbrk(0));
    return target;
  }
  function maxindex(source) {
    var result = 0;
    for (var i = 0; i < source.length; ++i) {
      var index = source[i];
      result = result < index ? index : result;
    }
    return result;
  }
  function index32(source, size) {
    assert(size == 2 || size == 4);
    if (size == 4) {
      return new Uint32Array(source.buffer, source.byteOffset, source.byteLength / 4);
    } else {
      var view = new Uint16Array(source.buffer, source.byteOffset, source.byteLength / 2);
      return new Uint32Array(view);
    }
  }
  function filter(fun, source, count, stride, bits, insize, mode) {
    var sbrk = instance.exports.sbrk;
    var tp = sbrk(count * stride);
    var sp = sbrk(count * insize);
    var heap = new Uint8Array(instance.exports.memory.buffer);
    heap.set(bytes(source), sp);
    fun(tp, count, stride, bits, sp, mode);
    var target = new Uint8Array(count * stride);
    target.set(heap.subarray(tp, tp + count * stride));
    sbrk(tp - sbrk(0));
    return target;
  }
  return {
    ready,
    supported: true,
    reorderMesh: function(indices, triangles, optsize) {
      assert(indices instanceof Uint32Array || indices instanceof Int32Array);
      assert(!triangles || indices.length % 3 == 0);
      var optf = triangles ? optsize ? instance.exports.meshopt_optimizeVertexCacheStrip : instance.exports.meshopt_optimizeVertexCache : void 0;
      return reorder(instance.exports.meshopt_optimizeVertexFetchRemap, indices, maxindex(indices) + 1, optf);
    },
    reorderPoints: function(positions, positions_stride) {
      assert(positions instanceof Float32Array);
      assert(positions.length % positions_stride == 0);
      assert(positions_stride >= 3);
      return spatialsort(instance.exports.meshopt_spatialSortRemap, positions, positions.length / positions_stride, positions_stride * 4);
    },
    encodeVertexBuffer: function(source, count, size) {
      assert(size > 0 && size <= 256);
      assert(size % 4 == 0);
      var bound = instance.exports.meshopt_encodeVertexBufferBound(count, size);
      return encode(instance.exports.meshopt_encodeVertexBuffer, bound, source, count, size);
    },
    encodeVertexBufferLevel: function(source, count, size, level, version) {
      assert(size > 0 && size <= 256);
      assert(size % 4 == 0);
      assert(level >= 0 && level <= 3);
      assert(version === void 0 || version == 0 || version == 1);
      var bound = instance.exports.meshopt_encodeVertexBufferBound(count, size);
      return encode(instance.exports.meshopt_encodeVertexBufferLevel, bound, source, count, size, level, version === void 0 ? -1 : version);
    },
    encodeIndexBuffer: function(source, count, size) {
      assert(size == 2 || size == 4);
      assert(count % 3 == 0);
      var indices = index32(source, size);
      var bound = instance.exports.meshopt_encodeIndexBufferBound(count, maxindex(indices) + 1);
      return encode(instance.exports.meshopt_encodeIndexBuffer, bound, indices, count, 4);
    },
    encodeIndexSequence: function(source, count, size) {
      assert(size == 2 || size == 4);
      var indices = index32(source, size);
      var bound = instance.exports.meshopt_encodeIndexSequenceBound(count, maxindex(indices) + 1);
      return encode(instance.exports.meshopt_encodeIndexSequence, bound, indices, count, 4);
    },
    encodeGltfBuffer: function(source, count, size, mode, version) {
      var table = {
        ATTRIBUTES: this.encodeVertexBufferLevel,
        TRIANGLES: this.encodeIndexBuffer,
        INDICES: this.encodeIndexSequence
      };
      assert(table[mode]);
      return table[mode](
        source,
        count,
        size,
        /* level= */
        2,
        version === void 0 ? 0 : version
      );
    },
    encodeFilterOct: function(source, count, stride, bits) {
      assert(stride == 4 || stride == 8);
      assert(bits >= 2 && bits <= 16);
      return filter(instance.exports.meshopt_encodeFilterOct, source, count, stride, bits, 16);
    },
    encodeFilterQuat: function(source, count, stride, bits) {
      assert(stride == 8);
      assert(bits >= 4 && bits <= 16);
      return filter(instance.exports.meshopt_encodeFilterQuat, source, count, stride, bits, 16);
    },
    encodeFilterExp: function(source, count, stride, bits, mode) {
      assert(stride > 0 && stride % 4 == 0);
      assert(bits >= 1 && bits <= 24);
      var table = {
        Separate: 0,
        SharedVector: 1,
        SharedComponent: 2,
        Clamped: 3
      };
      assert(!mode || mode in table);
      return filter(instance.exports.meshopt_encodeFilterExp, source, count, stride, bits, stride, mode ? table[mode] : 1);
    },
    encodeFilterColor: function(source, count, stride, bits) {
      assert(stride == 4 || stride == 8);
      assert(bits >= 2 && bits <= 16);
      return filter(instance.exports.meshopt_encodeFilterColor, source, count, stride, bits, 16);
    }
  };
})();

// node_modules/meshoptimizer/meshopt_decoder.mjs
var MeshoptDecoder = (function() {
  var wasm_base = "b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuixkbeeeddddillviebeoweuecj:Gdkr;Neqo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949WboY9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVJ9V29VVbrl79IV9Rbwq:VZkdbk:XYi5ud9:du8Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnalTmbcuhoaiRbbgrc;WeGc:Ge9hmbarcsGgwce0mbc9:hoalcufadcd4cbawEgDadfgrcKcaawEgqaraq0Egk6mbaicefhxcj;abad9Uc;WFbGcjdadca0EhmaialfgPar9Rgoadfhsavaoadz:jjjjbgzceVhHcbhOdndninaeaO9nmeaPax9RaD6mdamaeaO9RaOamfgoae6EgAcsfglc9WGhCabaOad2fhXaAcethQaxaDfhiaOaeaoaeao6E9RhLalcl4cifcd4hKazcj;cbfaAfhYcbh8AazcjdfhEaHh3incbh5dnawTmbaxa8Acd4fRbbh5kcbh8Eazcj;cbfhqinaih8Fdndndndna5a8Ecet4ciGgoc9:fPdebdkaPa8F9RaA6mrazcj;cbfa8EaA2fa8FaAz:jjjjb8Aa8FaAfhixdkazcj;cbfa8EaA2fcbaAz:kjjjb8Aa8FhixekaPa8F9RaK6mva8FaKfhidnaCTmbaPai9RcK6mbaocdtc:q:G:cjbfcj:G:cjbawEhaczhrcbhlinargoc9Wfghaqfhrdndndndndndnaaa8Fahco4fRbbalcoG4ciGcdtfydbPDbedvivvvlvkar9cb83bwar9cb83bbxlkarcbaiRbdai8Xbb9c:c:qj:bw9:9c:q;c1:I1e:d9c:b:c:e1z9:gg9cjjjjjz:dg8J9qE86bbaqaofgrcGfcbaicdfa8J9c8N1:NfghRbbag9cjjjjjw:dg8J9qE86bbarcVfcbaha8J9c8M1:NfghRbbag9cjjjjjl:dg8J9qE86bbarc7fcbaha8J9c8L1:NfghRbbag9cjjjjjd:dg8J9qE86bbarctfcbaha8J9c8K1:NfghRbbag9cjjjjje:dg8J9qE86bbarc91fcbaha8J9c8J1:NfghRbbag9cjjjj;ab:dg8J9qE86bbarc4fcbaha8J9cg1:NfghRbbag9cjjjja:dg8J9qE86bbarc93fcbaha8J9ch1:NfghRbbag9cjjjjz:dgg9qE86bbarc94fcbahag9ca1:NfghRbbai8Xbe9c:c:qj:bw9:9c:q;c1:I1e:d9c:b:c:e1z9:gg9cjjjjjz:dg8J9qE86bbarc95fcbaha8J9c8N1:NfgiRbbag9cjjjjjw:dg8J9qE86bbarc96fcbaia8J9c8M1:NfgiRbbag9cjjjjjl:dg8J9qE86bbarc97fcbaia8J9c8L1:NfgiRbbag9cjjjjjd:dg8J9qE86bbarc98fcbaia8J9c8K1:NfgiRbbag9cjjjjje:dg8J9qE86bbarc99fcbaia8J9c8J1:NfgiRbbag9cjjjj;ab:dg8J9qE86bbarc9:fcbaia8J9cg1:NfgiRbbag9cjjjja:dg8J9qE86bbarcufcbaia8J9ch1:NfgiRbbag9cjjjjz:dgg9qE86bbaiag9ca1:NfhixikaraiRblaiRbbghco4g8Ka8KciSg8KE86bbaqaofgrcGfaiclfa8Kfg8KRbbahcl4ciGg8La8LciSg8LE86bbarcVfa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc7fa8Ka8Lfg8KRbbahciGghahciSghE86bbarctfa8Kahfg8KRbbaiRbeghco4g8La8LciSg8LE86bbarc91fa8Ka8Lfg8KRbbahcl4ciGg8La8LciSg8LE86bbarc4fa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc93fa8Ka8Lfg8KRbbahciGghahciSghE86bbarc94fa8Kahfg8KRbbaiRbdghco4g8La8LciSg8LE86bbarc95fa8Ka8Lfg8KRbbahcl4ciGg8La8LciSg8LE86bbarc96fa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc97fa8Ka8Lfg8KRbbahciGghahciSghE86bbarc98fa8KahfghRbbaiRbigico4g8Ka8KciSg8KE86bbarc99faha8KfghRbbaicl4ciGg8Ka8KciSg8KE86bbarc9:faha8KfghRbbaicd4ciGg8Ka8KciSg8KE86bbarcufaha8KfgrRbbaiciGgiaiciSgiE86bbaraifhixdkaraiRbwaiRbbghcl4g8Ka8KcsSg8KE86bbaqaofgrcGfaicwfa8Kfg8KRbbahcsGghahcsSghE86bbarcVfa8KahfghRbbaiRbeg8Kcl4g8La8LcsSg8LE86bbarc7faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarctfaha8KfghRbbaiRbdg8Kcl4g8La8LcsSg8LE86bbarc91faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc4faha8KfghRbbaiRbig8Kcl4g8La8LcsSg8LE86bbarc93faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc94faha8KfghRbbaiRblg8Kcl4g8La8LcsSg8LE86bbarc95faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc96faha8KfghRbbaiRbvg8Kcl4g8La8LcsSg8LE86bbarc97faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc98faha8KfghRbbaiRbog8Kcl4g8La8LcsSg8LE86bbarc99faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc9:faha8KfghRbbaiRbrgicl4g8Ka8KcsSg8KE86bbarcufaha8KfgrRbbaicsGgiaicsSgiE86bbaraifhixekarai8Pbw83bwarai8Pbb83bbaiczfhikdnaoaC9pmbalcdfhlaoczfhraPai9RcL0mekkaoaC6moaimexokaCmva8FTmvkaqaAfhqa8Ecefg8Ecl9hmbkdndndndnawTmbasa8Acd4fRbbgociGPlbedrbkaATmdaza8Afh8Fazcj;cbfhhcbh8EaEhaina8FRbbhraahocbhlinaoahalfRbbgqce4cbaqceG9R7arfgr86bbaoadfhoaAalcefgl9hmbkaacefhaa8Fcefh8FahaAfhha8Ecefg8Ecl9hmbxikkaATmeaza8Afhaazcj;cbfhhcbhoceh8EaYh8FinaEaofhlaa8Vbbhrcbhoinala8FaofRbbcwtahaofRbbgqVc;:FiGce4cbaqceG9R7arfgr87bbaladfhlaLaocefgofmbka8FaQfh8FcdhoaacdfhaahaQfhha8EceGhlcbh8EalmbxdkkaATmbaocl4h8Eaza8AfRbbhqcwhoa3hlinalRbbaotaqVhqalcefhlaocwfgoca9hmbkcbhhaEh8FaYhainazcj;cbfahfRbbhrcwhoaahlinalRbbaotarVhralaAfhlaocwfgoca9hmbkara8E94aq7hqcbhoa8Fhlinalaqao486bbalcefhlaocwfgoca9hmbka8Fadfh8FaacefhaahcefghaA9hmbkkaEclfhEa3clfh3a8Aclfg8Aad6mbkaXazcjdfaAad2z:jjjjb8AazazcjdfaAcufad2fadz:jjjjb8AaAaOfhOaihxaimbkc9:hoxdkcbc99aPax9RakSEhoxekc9:hokavcj;kbf8Kjjjjbaok:ysezu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnalaeci9UgrcHf6mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecjez:kjjjb8Aav9cu83iUav9cu83i8Wav9cu83iyav9cu83iaav9cu83iKav9cu83izav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhldnaeTmbcmcsaDceSEhkcbhxcbhmcbhrcbhicbhoindnalaq9nmbc9:hoxikdndnawRbbgDc;Ve0mbavc;abfaoaDcu7gPcl4fcsGcitfgsydlhzasydbhHdndnaDcsGgsak9pmbavaiaPfcsGcdtfydbaxasEhDaxasTgOfhxxekdndnascsSmbcehOasc987asamffcefhDxekalcefhDal8SbbgscFeGhPdndnascu9mmbaDhlxekalcvfhlaPcFbGhPcrhsdninaD8SbbgOcFbGastaPVhPaOcu9kmeaDcefhDascrfgsc8J9hmbxdkkaDcefhlkcehOaPce4cbaPceG9R7amfhDkaDhmkavc;abfaocitfgsaDBdbasazBdlavaicdtfaDBdbavc;abfaocefcsGcitfgsaHBdbasaDBdlaocdfhoaOaifhidnadcd9hmbabarcetfgsaH87ebasclfaD87ebascdfaz87ebxdkabarcdtfgsaHBdbascwfaDBdbasclfazBdbxekdnaDcpe0mbavaiaqaDcsGfRbbgscl4gP9RcsGcdtfydbaxcefgOaPEhDavaias9RcsGcdtfydbaOaPTgzfgOascsGgPEhsaPThPdndnadcd9hmbabarcetfgHax87ebaHclfas87ebaHcdfaD87ebxekabarcdtfgHaxBdbaHcwfasBdbaHclfaDBdbkavaicdtfaxBdbavc;abfaocitfgHaDBdbaHaxBdlavaicefgicsGcdtfaDBdbavc;abfaocefcsGcitfgHasBdbaHaDBdlavaiazfgicsGcdtfasBdbavc;abfaocdfcsGcitfgDaxBdbaDasBdlaocifhoaiaPfhiaOaPfhxxekaxcbalRbbgsEgHaDc;:eSgDfhOascsGhAdndnascl4gCmbaOcefhzxekaOhzavaiaC9RcsGcdtfydbhOkdndnaAmbazcefhxxekazhxavaias9RcsGcdtfydbhzkdndnaDTmbalcefhDxekalcdfhDal8SbegPcFeGhsdnaPcu9kmbalcofhHascFbGhscrhldninaD8SbbgPcFbGaltasVhsaPcu9kmeaDcefhDalcrfglc8J9hmbkaHhDxekaDcefhDkasce4cbasceG9R7amfgmhHkdndnaCcsSmbaDhsxekaDcefhsaD8SbbglcFeGhPdnalcu9kmbaDcvfhOaPcFbGhPcrhldninas8SbbgDcFbGaltaPVhPaDcu9kmeascefhsalcrfglc8J9hmbkaOhsxekascefhskaPce4cbaPceG9R7amfgmhOkdndnaAcsSmbashlxekascefhlas8SbbgDcFeGhPdnaDcu9kmbascvfhzaPcFbGhPcrhDdninal8SbbgscFbGaDtaPVhPascu9kmealcefhlaDcrfgDc8J9hmbkazhlxekalcefhlkaPce4cbaPceG9R7amfgmhzkdndnadcd9hmbabarcetfgDaH87ebaDclfaz87ebaDcdfaO87ebxekabarcdtfgDaHBdbaDcwfazBdbaDclfaOBdbkavc;abfaocitfgDaOBdbaDaHBdlavaicdtfaHBdbavc;abfaocefcsGcitfgDazBdbaDaOBdlavaicefgicsGcdtfaOBdbavc;abfaocdfcsGcitfgDaHBdbaDazBdlavaiaCTaCcsSVfgicsGcdtfazBdbaiaATaAcsSVfhiaocifhokawcefhwaocsGhoaicsGhiarcifgrae6mbkkcbc99alaqSEhokavc;aef8Kjjjjbaok:clevu8Jjjjjbcz9Rhvdnalaecvf9pmbc9:skdnaiRbbc;:eGc;qeSmbcuskav9cb83iwaicefhoaialfc98fhrdnaeTmbdnadcdSmbcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcdtfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgiBdbalaiBdbawcefgwae9hmbxdkkcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcetfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgi87ebalaiBdbawcefgwae9hmbkkcbc99aoarSEk:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk:4ioiue99dud99dud99dnaeTmbcbhiabhlindndnal8Uebgv:YgoJ:ji:1Salcof8UebgrciVgw:Y:vgDNJbbbZJbbb:;avcu9kEMgq:lJbbb9p9DTmbaq:Ohkxekcjjjj94hkkalclf8Uebhvalcdf8UebhxalarcefciGcetfak87ebdndnax:YgqaDNJbbbZJbbb:;axcu9kEMgm:lJbbb9p9DTmbam:Ohxxekcjjjj94hxkabaiarciGgkfcd7cetfax87ebdndnav:YgmaDNJbbbZJbbb:;avcu9kEMgP:lJbbb9p9DTmbaP:Ohvxekcjjjj94hvkalarcufciGcetfav87ebdndnawaw2:ZgPaPMaoaoN:taqaqN:tamamN:tgoJbbbbaoJbbbb9GE:raDNJbbbZMgD:lJbbb9p9DTmbaD:Ohrxekcjjjj94hrkalakcetfar87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2gdTmbinababydbgecwtcw91:Yaece91cjjj98Gcjjj;8if::NUdbabclfhbadcufgdmbkkk:Tvirud99eudndnadcl9hmbaeTmeindndnabRbbgiabcefgl8Sbbgvabcdfgo8Sbbgrf9R:YJbbuJabcifgwRbbgdce4adVgDcd4aDVgDcl4aDVgD:Z:vgqNJbbbZMgk:lJbbb9p9DTmbak:Ohxxekcjjjj94hxkaoax86bbdndnaraif:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohoxekcjjjj94hokalao86bbdndnavaifar9R:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikabai86bbdndnaDadcetGadceGV:ZaqNJbbbZMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkawad86bbabclfhbaecufgembxdkkaeTmbindndnab8Vebgiabcdfgl8Uebgvabclfgo8Uebgrf9R:YJbFu9habcofgw8Vebgdce4adVgDcd4aDVgDcl4aDVgDcw4aDVgD:Z:vgqNJbbbZMgk:lJbbb9p9DTmbak:Ohxxekcjjjj94hxkaoax87ebdndnaraif:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohoxekcjjjj94hokalao87ebdndnavaifar9R:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikabai87ebdndnaDadcetGadceGV:ZaqNJbbbZMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkawad87ebabcwfhbaecufgembkkk9teiucbcbyd:K:G:cjbgeabcifc98GfgbBd:K:G:cjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaeczfheaiczfhiadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkk83dbcj:Gdk8Kbbbbdbbblbbbwbbbbbbbebbbdbbblbbbwbbbbc:K:Gdkl8W:qbb";
  var wasm_simd = "b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuixkbbebeeddddilve9Weeeviebeoweuecj:Gdkr;Neqo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949WbwY9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVJ9V29VVbDl79IV9Rbqq:W9Dklbzik94evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaeai86b:q:W:cjbaecitab8Piw83i:q:G:cjbaecefgecjd9hmbkk:JBl8Aud97dur978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnalTmbcuhoaiRbbgrc;WeGc:Ge9hmbarcsGgwce0mbc9:hoalcufadcd4cbawEgDadfgrcKcaawEgqaraq0Egk6mbaialfgxar9RhodnadTgmmbavaoad;8qbbkaicefhPcj;abad9Uc;WFbGcjdadca0EhsdndndnadTmbaoadfhzcbhHinaeaH9nmdaxaP9RaD6miabaHad2fhOaPaDfhAasaeaH9RaHasfae6EgCcsfgocl4cifcd4hXavcj;cbfaoc9WGgQcetfhLavcj;cbfaQci2fhKavcj;cbfaQfhYcbh8Aaoc;ab6hEincbh3dnawTmbaPa8Acd4fRbbh3kcbh5avcj;cbfh8Eindndndndna3a5cet4ciGgoc9:fPdebdkaxaA9RaQ6mwdnaQTmbavcj;cbfa5aQ2faAaQ;8qbbkaAaCfhAxdkaQTmeavcj;cbfa5aQ2fcbaQ;8kbxekaxaA9RaX6moaoclVcbawEhraAaXfhocbhidnaEmbaxao9Rc;Gb6mbcbhlina8EalfhidndndndndndnaAalco4fRbbgqciGarfPDbedibledibkaipxbbbbbbbbbbbbbbbbpklbxlkaiaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaiaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaiaopbbbpklbaoczfhoxekaiaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqcd4ciGarfPDbedibledibkaiczfpxbbbbbbbbbbbbbbbbpklbxlkaiczfaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaiczfaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaiczfaopbbbpklbaoczfhoxekaiczfaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqcl4ciGarfPDbedibledibkaicafpxbbbbbbbbbbbbbbbbpklbxlkaicafaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaicafaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaicafaopbbbpklbaoczfhoxekaicafaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqco4arfPDbedibledibkaic8Wfpxbbbbbbbbbbbbbbbbpklbxlkaic8Wfaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Ngicitpbi:q:G:cjbaiRb:q:W:cjbgipsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Ngqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbaiaoclffaqRb:q:W:cjbfhoxikaic8Wfaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Ngicitpbi:q:G:cjbaiRb:q:W:cjbgipsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Ngqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbaiaocwffaqRb:q:W:cjbfhoxdkaic8Wfaopbbbpklbaoczfhoxekaic8WfaopbbdaoRbbgicitpbi:q:G:cjbaiRb:q:W:cjbgipsaoRbegqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbaiaocdffaqRb:q:W:cjbfhokalc;abfhialcjefaQ0meaihlaxao9Rc;Fb0mbkkdnaiaQ9pmbaici4hlinaxao9RcK6mwa8EaifhqdndndndndndnaAaico4fRbbalcoG4ciGarfPDbedibledibkaqpxbbbbbbbbbbbbbbbbpkbbxlkaqaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spkbbahaoclffagRb:q:W:cjbfhoxikaqaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spkbbahaocwffagRb:q:W:cjbfhoxdkaqaopbbbpkbbaoczfhoxekaqaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpkbbahaocdffagRb:q:W:cjbfhokalcdfhlaiczfgiaQ6mbkkaohAaoTmoka8EaQfh8Ea5cefg5cl9hmbkdndndndnawTmbaza8Acd4fRbbglciGPlbedwbkaQTmdavcjdfa8Afhlava8Afpbdbh8Jcbhoinalavcj;cbfaofpblbg8KaYaofpblbg8LpmbzeHdOiAlCvXoQrLg8MaLaofpblbg8NaKaofpblbgypmbzeHdOiAlCvXoQrLg8PpmbezHdiOAlvCXorQLg8Fcep9Ta8Fpxeeeeeeeeeeeeeeeegap9op9Hp9rg8Fa8Jp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ma8PpmwDKYqk8AExm35Ps8E8Fg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ka8LpmwKDYq8AkEx3m5P8Es8Fg8Ka8NaypmwKDYq8AkEx3m5P8Es8Fg8LpmbezHdiOAlvCXorQLg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ka8LpmwDKYqk8AExm35Ps8E8Fg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ugap9Abbbaladfglaaa8Fa8Fpmlvorlvorlvorlvorp9Ugap9Abbbaladfglaaa8Fa8FpmwDqkwDqkwDqkwDqkp9Ugap9Abbbaladfglaaa8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9AbbbaladfhlaoczfgoaQ6mbxikkaQTmeavcjdfa8Afhlava8Afpbdbh8Jcbhoinalavcj;cbfaofpblbg8KaYaofpblbg8LpmbzeHdOiAlCvXoQrLg8MaLaofpblbg8NaKaofpblbgypmbzeHdOiAlCvXoQrLg8PpmbezHdiOAlvCXorQLg8Fcep:nea8Fpxebebebebebebebebgap9op:bep9rg8Fa8Jp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ma8PpmwDKYqk8AExm35Ps8E8Fg8Fcep:nea8Faap9op:bep9rg8Fp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ka8LpmwKDYq8AkEx3m5P8Es8Fg8Ka8NaypmwKDYq8AkEx3m5P8Es8Fg8LpmbezHdiOAlvCXorQLg8Fcep:nea8Faap9op:bep9rg8Fp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ka8LpmwDKYqk8AExm35Ps8E8Fg8Fcep:nea8Faap9op:bep9rg8Fp:oegap9Abbbaladfglaaa8Fa8Fpmlvorlvorlvorlvorp:oegap9Abbbaladfglaaa8Fa8FpmwDqkwDqkwDqkwDqkp:oegap9Abbbaladfglaaa8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9AbbbaladfhlaoczfgoaQ6mbxdkkaQTmbcbhocbalcl4gl9Rc8FGhiavcjdfa8Afhrava8Afpbdbhainaravcj;cbfaofpblbg8JaYaofpblbg8KpmbzeHdOiAlCvXoQrLg8LaLaofpblbg8MaKaofpblbg8NpmbzeHdOiAlCvXoQrLgypmbezHdiOAlvCXorQLg8Faip:Rea8Falp:Tep9qg8Faap9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8LaypmwDKYqk8AExm35Ps8E8Fg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8Ja8KpmwKDYq8AkEx3m5P8Es8Fg8Ja8Ma8NpmwKDYq8AkEx3m5P8Es8Fg8KpmbezHdiOAlvCXorQLg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8Ja8KpmwDKYqk8AExm35Ps8E8Fg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9AbbbaradfhraoczfgoaQ6mbkka8Aclfg8Aad6mbkdnaCad2goTmbaOavcjdfao;8qbbkdnammbavavcjdfaCcufad2fad;8qbbkaCaHfhHc9:hoaAhPaAmbxlkkaeTmbaDalfhrcbhocuhlinaralaD9RglfaD6mdasaeao9Raoasfae6Eaofgoae6mbkaial9RhPkcbc99axaP9RakSEhoxekc9:hokavcj;kbf8Kjjjjbaokwbz:bjjjbkNsezu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnalaeci9UgrcHf6mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecje;8kbav9cu83iUav9cu83i8Wav9cu83iyav9cu83iaav9cu83iKav9cu83izav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhldnaeTmbcmcsaDceSEhkcbhxcbhmcbhrcbhicbhoindnalaq9nmbc9:hoxikdndnawRbbgDc;Ve0mbavc;abfaoaDcu7gPcl4fcsGcitfgsydlhzasydbhHdndnaDcsGgsak9pmbavaiaPfcsGcdtfydbaxasEhDaxasTgOfhxxekdndnascsSmbcehOasc987asamffcefhDxekalcefhDal8SbbgscFeGhPdndnascu9mmbaDhlxekalcvfhlaPcFbGhPcrhsdninaD8SbbgOcFbGastaPVhPaOcu9kmeaDcefhDascrfgsc8J9hmbxdkkaDcefhlkcehOaPce4cbaPceG9R7amfhDkaDhmkavc;abfaocitfgsaDBdbasazBdlavaicdtfaDBdbavc;abfaocefcsGcitfgsaHBdbasaDBdlaocdfhoaOaifhidnadcd9hmbabarcetfgsaH87ebasclfaD87ebascdfaz87ebxdkabarcdtfgsaHBdbascwfaDBdbasclfazBdbxekdnaDcpe0mbavaiaqaDcsGfRbbgscl4gP9RcsGcdtfydbaxcefgOaPEhDavaias9RcsGcdtfydbaOaPTgzfgOascsGgPEhsaPThPdndnadcd9hmbabarcetfgHax87ebaHclfas87ebaHcdfaD87ebxekabarcdtfgHaxBdbaHcwfasBdbaHclfaDBdbkavaicdtfaxBdbavc;abfaocitfgHaDBdbaHaxBdlavaicefgicsGcdtfaDBdbavc;abfaocefcsGcitfgHasBdbaHaDBdlavaiazfgicsGcdtfasBdbavc;abfaocdfcsGcitfgDaxBdbaDasBdlaocifhoaiaPfhiaOaPfhxxekaxcbalRbbgsEgHaDc;:eSgDfhOascsGhAdndnascl4gCmbaOcefhzxekaOhzavaiaC9RcsGcdtfydbhOkdndnaAmbazcefhxxekazhxavaias9RcsGcdtfydbhzkdndnaDTmbalcefhDxekalcdfhDal8SbegPcFeGhsdnaPcu9kmbalcofhHascFbGhscrhldninaD8SbbgPcFbGaltasVhsaPcu9kmeaDcefhDalcrfglc8J9hmbkaHhDxekaDcefhDkasce4cbasceG9R7amfgmhHkdndnaCcsSmbaDhsxekaDcefhsaD8SbbglcFeGhPdnalcu9kmbaDcvfhOaPcFbGhPcrhldninas8SbbgDcFbGaltaPVhPaDcu9kmeascefhsalcrfglc8J9hmbkaOhsxekascefhskaPce4cbaPceG9R7amfgmhOkdndnaAcsSmbashlxekascefhlas8SbbgDcFeGhPdnaDcu9kmbascvfhzaPcFbGhPcrhDdninal8SbbgscFbGaDtaPVhPascu9kmealcefhlaDcrfgDc8J9hmbkazhlxekalcefhlkaPce4cbaPceG9R7amfgmhzkdndnadcd9hmbabarcetfgDaH87ebaDclfaz87ebaDcdfaO87ebxekabarcdtfgDaHBdbaDcwfazBdbaDclfaOBdbkavc;abfaocitfgDaOBdbaDaHBdlavaicdtfaHBdbavc;abfaocefcsGcitfgDazBdbaDaOBdlavaicefgicsGcdtfaOBdbavc;abfaocdfcsGcitfgDaHBdbaDazBdlavaiaCTaCcsSVfgicsGcdtfazBdbaiaATaAcsSVfhiaocifhokawcefhwaocsGhoaicsGhiarcifgrae6mbkkcbc99alaqSEhokavc;aef8Kjjjjbaok:clevu8Jjjjjbcz9Rhvdnalaecvf9pmbc9:skdnaiRbbc;:eGc;qeSmbcuskav9cb83iwaicefhoaialfc98fhrdnaeTmbdnadcdSmbcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcdtfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgiBdbalaiBdbawcefgwae9hmbxdkkcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcetfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgi87ebalaiBdbawcefgwae9hmbkkcbc99aoarSEk;Toio97eue97aec98Ghedndnadcl9hmbaeTmecbhdinababpbbbgicKp:RecKp:Sep;6eglaicwp:RecKp:Sep;6ealp;Geaiczp:RecKp:Sep;6egvp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egralpxbbbjbbbjbbbjbbbjgwp9op9rp;Keglpxbb;:9cbb;:9cbb;:9cbb;:9calalp;Meaoaop;Meavaravawp9op9rp;Keglalp;Mep;Kep;Kep;Jep;Negvp;Mepxbbn0bbn0bbn0bbn0grp;KepxFbbbFbbbFbbbFbbbp9oaipxbbbFbbbFbbbFbbbFp9op9qalavp;Mearp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaoavp;Mearp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbabczfhbadclfgdae6mbxdkkaeTmbcbhdinabczfgDaDpbbbgipxbbbbbbFFbbbbbbFFgwp9oabpbbbgoaipmbediwDqkzHOAKY8AEgvczp:Reczp:Sep;6eglaoaipmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eavczp:Sep;6egvp;Gealp;Gep;Kep;Legipxbbbbbbbbbbbbbbbbp:2egralpxbbbjbbbjbbbjbbbjgqp9op9rp;Keglpxb;:FSb;:FSb;:FSb;:FSalalp;Meaiaip;Meavaravaqp9op9rp;Keglalp;Mep;Kep;Kep;Jep;Negvp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbp9oaiavp;Mearp;Keczp:Rep9qgialavp;Mearp;KepxFFbbFFbbFFbbFFbbp9oglpmwDKYqk8AExm35Ps8E8Fp9qpkbbabaoawp9oaialpmbezHdiOAlvCXorQLp9qpkbbabcafhbadclfgdae6mbkkk;2ileue97euo97dnaec98GgiTmbcbheinabcKfpx:ji:1S:ji:1S:ji:1S:ji:1SabpbbbglabczfgvpbbbgopmlvorxmPsCXQL358E8Fgrczp:Segwpxibbbibbbibbbibbbp9qp;6egDp;NegqaDaDp;MegDaDp;KealaopmbediwDqkzHOAKY8AEgDczp:Reczp:Sep;6eglalp;MeaDczp:Sep;6egoaop;Mearczp:Reczp:Sep;6egrarp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jep;Mepxbbn0bbn0bbn0bbn0gDp;KepxFFbbFFbbFFbbFFbbgkp9oaqaop;MeaDp;Keczp:Rep9qgoaqalp;MeaDp;Keakp9oaqarp;MeaDp;Keczp:Rep9qgDpmwDKYqk8AExm35Ps8E8Fglp5eawclp:RegqpEi:T:j83ibavalp5baqpEd:T:j83ibabcwfaoaDpmbezHdiOAlvCXorQLgDp5eaqpEe:T:j83ibabaDp5baqpEb:T:j83ibabcafhbaeclfgeai6mbkkkuee97dnadcd4ae2c98GgeTmbcbhdinababpbbbgicwp:Recwp:Sep;6eaicep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepkbbabczfhbadclfgdae6mbkkk:Sodw97euaec98Ghedndnadcl9hmbaeTmecbhdinabpxbbuJbbuJbbuJbbuJabpbbbgicKp:TeglaicYp:Tep9qgvcdp:Teavp9qgvclp:Teavp9qgop;6ep;Negvaicwp:RecKp:SegraipxFbbbFbbbFbbbFbbbgwp9ogDp:Uep;6ep;Mepxbbn0bbn0bbn0bbn0gqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9oavaDarp:Xeaiczp:RecKp:Segip:Uep;6ep;Meaqp;Keawp9op9qavaDaraip:Uep:Xep;6ep;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qavaoalcep:Rep9oalpxebbbebbbebbbebbbp9op9qp;6ep;Meaqp;KecKp:Rep9qpkbbabczfhbadclfgdae6mbxdkkaeTmbcbhdinabczfgkpxbFu9hbFu9hbFu9hbFu9habpbbbglakpbbbgrpmlvorxmPsCXQL358E8Fgvczp:TegqavcHp:Tep9qgicdp:Teaip9qgiclp:Teaip9qgicwp:Teaip9qgop;6ep;NegialarpmbediwDqkzHOAKY8AEgDpxFFbbFFbbFFbbFFbbglp9ograDczp:Segwp:Ueavczp:Reczp:SegDp:Xep;6ep;Mepxbbn0bbn0bbn0bbn0gvp;Kealp9oaiarawaDp:Uep:Xep;6ep;Meavp;Keczp:Rep9qgwaiaoaqcep:Rep9oaqpxebbbebbbebbbebbbp9op9qp;6ep;Meavp;Keczp:ReaiaDarp:Uep;6ep;Meavp;Kealp9op9qgipmwDKYqk8AExm35Ps8E8FpkbbabawaipmbezHdiOAlvCXorQLpkbbabcafhbadclfgdae6mbkkk9teiucbcbydj:G:cjbgeabcifc98GfgbBdj:G:cjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkxebcj:Gdklz:zbb";
  var detector = new Uint8Array([
    0,
    97,
    115,
    109,
    1,
    0,
    0,
    0,
    1,
    4,
    1,
    96,
    0,
    0,
    3,
    3,
    2,
    0,
    0,
    5,
    3,
    1,
    0,
    1,
    12,
    1,
    0,
    10,
    22,
    2,
    12,
    0,
    65,
    0,
    65,
    0,
    65,
    0,
    252,
    10,
    0,
    0,
    11,
    7,
    0,
    65,
    0,
    253,
    15,
    26,
    11
  ]);
  var wasmpack = new Uint8Array([
    32,
    0,
    65,
    2,
    1,
    106,
    34,
    33,
    3,
    128,
    11,
    4,
    13,
    64,
    6,
    253,
    10,
    7,
    15,
    116,
    127,
    5,
    8,
    12,
    40,
    16,
    19,
    54,
    20,
    9,
    27,
    255,
    113,
    17,
    42,
    67,
    24,
    23,
    146,
    148,
    18,
    14,
    22,
    45,
    70,
    69,
    56,
    114,
    101,
    21,
    25,
    63,
    75,
    136,
    108,
    28,
    118,
    29,
    73,
    115
  ]);
  if (typeof WebAssembly !== "object") {
    return {
      supported: false
    };
  }
  var wasm = WebAssembly.validate(detector) ? unpack(wasm_simd) : unpack(wasm_base);
  var instance;
  var ready = WebAssembly.instantiate(wasm, {}).then(function(result) {
    instance = result.instance;
    instance.exports.__wasm_call_ctors();
  });
  function unpack(data) {
    var result = new Uint8Array(data.length);
    for (var i = 0; i < data.length; ++i) {
      var ch = data.charCodeAt(i);
      result[i] = ch > 96 ? ch - 97 : ch > 64 ? ch - 39 : ch + 4;
    }
    var write = 0;
    for (var i = 0; i < data.length; ++i) {
      result[write++] = result[i] < 60 ? wasmpack[result[i]] : (result[i] - 60) * 64 + result[++i];
    }
    return result.buffer.slice(0, write);
  }
  function decode(instance2, fun, target, count, size, source, filter) {
    var sbrk = instance2.exports.sbrk;
    var count4 = count + 3 & ~3;
    var tp = sbrk(count4 * size);
    var sp = sbrk(source.length);
    var heap = new Uint8Array(instance2.exports.memory.buffer);
    heap.set(source, sp);
    var res = fun(tp, count, size, sp, source.length);
    if (res == 0 && filter) {
      filter(tp, count4, size);
    }
    target.set(heap.subarray(tp, tp + count * size));
    sbrk(tp - sbrk(0));
    if (res != 0) {
      throw new Error("Malformed buffer data: " + res);
    }
  }
  var filters = {
    NONE: "",
    OCTAHEDRAL: "meshopt_decodeFilterOct",
    QUATERNION: "meshopt_decodeFilterQuat",
    EXPONENTIAL: "meshopt_decodeFilterExp",
    COLOR: "meshopt_decodeFilterColor"
  };
  var decoders = {
    ATTRIBUTES: "meshopt_decodeVertexBuffer",
    TRIANGLES: "meshopt_decodeIndexBuffer",
    INDICES: "meshopt_decodeIndexSequence"
  };
  var workers = [];
  var requestId = 0;
  function createWorker2(url) {
    var worker = {
      object: new Worker(url),
      pending: 0,
      requests: {}
    };
    worker.object.onmessage = function(event) {
      var data = event.data;
      worker.pending -= data.count;
      worker.requests[data.id][data.action](data.value);
      delete worker.requests[data.id];
    };
    return worker;
  }
  function initWorkers(count) {
    var source = "self.ready = WebAssembly.instantiate(new Uint8Array([" + new Uint8Array(wasm) + "]), {}).then(function(result) { result.instance.exports.__wasm_call_ctors(); return result.instance; });self.onmessage = " + workerProcess.name + ";" + decode.toString() + workerProcess.toString();
    var blob = new Blob([source], { type: "text/javascript" });
    var url = URL.createObjectURL(blob);
    for (var i = workers.length; i < count; ++i) {
      workers[i] = createWorker2(url);
    }
    for (var i = count; i < workers.length; ++i) {
      workers[i].object.postMessage({});
    }
    workers.length = count;
    URL.revokeObjectURL(url);
  }
  function decodeWorker(count, size, source, mode, filter) {
    var worker = workers[0];
    for (var i = 1; i < workers.length; ++i) {
      if (workers[i].pending < worker.pending) {
        worker = workers[i];
      }
    }
    return new Promise(function(resolve, reject) {
      var data = new Uint8Array(source);
      var id = ++requestId;
      worker.pending += count;
      worker.requests[id] = { resolve, reject };
      worker.object.postMessage({ id, count, size, source: data, mode, filter }, [data.buffer]);
    });
  }
  function workerProcess(event) {
    var data = event.data;
    self.ready.then(function(instance2) {
      if (!data.id) {
        return self.close();
      }
      try {
        var target = new Uint8Array(data.count * data.size);
        decode(instance2, instance2.exports[data.mode], target, data.count, data.size, data.source, instance2.exports[data.filter]);
        self.postMessage({ id: data.id, count: data.count, action: "resolve", value: target }, [target.buffer]);
      } catch (error) {
        self.postMessage({ id: data.id, count: data.count, action: "reject", value: error });
      }
    });
  }
  return {
    ready,
    supported: true,
    useWorkers: function(count) {
      initWorkers(count);
    },
    decodeVertexBuffer: function(target, count, size, source, filter) {
      decode(instance, instance.exports.meshopt_decodeVertexBuffer, target, count, size, source, instance.exports[filters[filter]]);
    },
    decodeIndexBuffer: function(target, count, size, source) {
      decode(instance, instance.exports.meshopt_decodeIndexBuffer, target, count, size, source);
    },
    decodeIndexSequence: function(target, count, size, source) {
      decode(instance, instance.exports.meshopt_decodeIndexSequence, target, count, size, source);
    },
    decodeGltfBuffer: function(target, count, size, source, mode, filter) {
      decode(instance, instance.exports[decoders[mode]], target, count, size, source, instance.exports[filters[filter]]);
    },
    decodeGltfBufferAsync: function(count, size, source, mode, filter) {
      if (workers.length > 0) {
        return decodeWorker(count, size, source, decoders[mode], filters[filter]);
      }
      return ready.then(function() {
        var target = new Uint8Array(count * size);
        decode(instance, instance.exports[decoders[mode]], target, count, size, source, instance.exports[filters[filter]]);
        return target;
      });
    }
  };
})();

// node_modules/meshoptimizer/meshopt_simplifier.js
var MeshoptSimplifier = (function() {
  var wasm = "b9H79Tebbbe:6eO9Geueu9Geub9Gbb9Gsuuuuuuuuuuuu99uueu9Gvuuuuub9Gruuuuuuub9Gouuuuuue999Gvuuuuueu9Gzuuuuuuuuuuu99uuuub9Gquuuuuuu99uueu9GPuuuuuuuuuuu99uueu9Gquuuuuuuu99ueu9Gruuuuuu99eu9Gwuuuuuu99ueu9Giuuue999Gluuuueu9Gluuuub9GiuuueuiLQdilvorlwDiqkxmPszbHHbelve9Weiiviebeoweuecj:Gdkr:Bdxo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bbz9TW79O9V9Wt9F79P9T9W29P9M95bw8E9TW79O9V9Wt9F79P9T9W29P9M959x9Pt9OcttV9P9I91tW7bD8A9TW79O9V9Wt9F79P9T9W29P9M959x9Pt9O9v9W9K9HtWbqQ9TW79O9V9Wt9F79P9T9W29P9M959t29V9W9W95bkX9TW79O9V9Wt9F79P9T9W29P9M959qV919UWbxQ9TW79O9V9Wt9F79P9T9W29P9M959q9V9P9Ut7bmX9TW79O9V9Wt9F79P9T9W29P9M959t9J9H2WbPa9TW79O9V9Wt9F9V9Wt9P9T9P96W9wWVtW94SWt9J9O9sW9T9H9Wbs59TW79O9V9Wt9F9NW9UWV9HtW9q9V79Pt9P9V9U9sW9T9H9Wbzl79IV9RbHDwebcekdCXq;y;WeQdbk;r:herYue99iuY99Xue9:D998Jjjjjbcj;sb9Rgs8Kjjjjbcbhzasc:Cefcbc;Kbz:tjjjb8AdnabaeSmbabaeadcdtzMjjjb8AkdnamcdGTmbalcrfci4cbyd1:H:cjbHjjjjbbhHasc:Cefasyd;8egecdtfaHBdbasaecefBd;8ecbhlcbhednadTmbabheadhOinaHaeydbci4fcb86bbaeclfheaOcufgOmbkcbhlabheadhOinaHaeydbgAci4fgCaCRbbgCceaAcrGgAtV86bbaCcu7aA4ceGalfhlaeclfheaOcufgOmbkcualcdtalcFFFFi0Ehekaecbyd1:H:cjbHjjjjbbhzasc:Cefasyd;8egecdtfazBdbasaecefBd;8ealcd4alfhOcehHinaHgecethHaeaO6mbkcbhXcuaecdtgOaecFFFFi0Ecbyd1:H:cjbHjjjjbbhHasc:Cefasyd;8egAcdtfaHBdbasaAcefBd;8eaHcFeaOz:tjjjbhQdnadTmbaecufhLcbhKindndnaQabaKcdtfgYydbgAc:v;t;h;Ev2aLGgOcdtfgCydbgHcuSmbceheinazaHcdtfydbaASmdaOaefhHaecefheaQaHaLGgOcdtfgCydbgHcu9hmbkkazaXcdtfaABdbaCaXBdbaXhHaXcefhXkaYaHBdbaKcefgKad9hmbkkaQcbyd:m:H:cjbH:bjjjbbasasyd;8ecufBd;8ekcbh8AcualcefgecdtaecFFFFi0Ecbyd1:H:cjbHjjjjbbhLasc:Cefasyd;8egecdtfaLBdbasaLBdNeasaecefBd;8ecuadcitadcFFFFe0Ecbyd1:H:cjbHjjjjbbhEasc:Cefasyd;8egecdtfaEBdbasaEBd:yeasaecefBd;8eascNefabadalcbz:cjjjbcualcdtgealcFFFFi0Eg3cbyd1:H:cjbHjjjjbbhOasc:Cefasyd;8egHcdtfaOBdbasaHcefBd;8ea3cbyd1:H:cjbHjjjjbbhQasc:Cefasyd;8egHcdtfaQBdbasaHcefBd;8eaOaQaialavazasc:Cefz:djjjbalcbyd1:H:cjbHjjjjbbhYasc:Cefasyd;8egHcdtfaYBdbasaHcefBd;8ea3cbyd1:H:cjbHjjjjbbhHasc:Cefasyd;8egAcdtfaHBdbasaAcefBd;8ea3cbyd1:H:cjbHjjjjbbhAasc:Cefasyd;8egCcdtfaABdbasaCcefBd;8eaHcFeaez:tjjjbh5aAcFeaez:tjjjbh8EdnalTmbindnaLa8AgAcefg8AcdtfydbgCaLaAcdtgefydbgHSmbaCaH9Rh8FaEaHcitfhaa8Eaefhha5aefhKcbhCindndnaaaCcitfydbgXaA9hmbaKaABdbahaABdbxekdnaLaXcdtggfgeclfydbgHaeydbgeSmbaHae9RhHaEaecitfheinaeydbaASmdaecwfheaHcufgHmbkka8EagfgeaAaXaeydbcuSEBdbaKaXaAaKydbcuSEBdbkaCcefgCa8F9hmbkka8Aal9hmbkaOhHaQhAa5hXa8EhCcbheindndnaeaHydbgK9hmbdnaeaAydbgK9hmbaXydbhKdnaCydbg8Fcu9hmbaKcu9hmbaYaefcb86bbxikdna8FcuSmbaKcuSmbaea8FSmbaOa8FcdtfydbaOaKcdtfydb9hmbaYaefcd86bbxikaYaefhadnaea8FSmbaeaKSmbaace86bbxikaacl86bbxdkdnaeaQaKcdtg8Ffydb9hmbdnaCydbgacuSmbaeaaSmbaXydbggcuSmbaeagSmba8Ea8FfydbghcuSmbahaKSmba5a8Ffydbg8FcuSmba8FaKSmbdnaOaacdtfydbgKaOa8Fcdtfydb9hmbaKaOagcdtfydbg8FSmba8FaOahcdtfydb9hmbaYaefcd86bbxlkaYaefcl86bbxikaYaefcl86bbxdkaYaefcl86bbxekaYaefaYaKfRbb86bbkaHclfhHaAclfhAaXclfhXaCclfhCalaecefge9hmbkdnamcaGTmbcbh8JindndnaYa8Jfg8KRbbg8Lc9:fPibebekdndndnaOa8Jcdtfydbgea8J9hmbdnaqmbcbh8FxdkdnazTmbcbh8Fa8JheinaqazaecdtgefydbfRbbce4a8FVceGh8FaQaefydbgea8J9hmbxikkcbh8Fa8JheinaqaefRbbce4a8FVceGh8FaQaecdtfydbgea8J9hmbxdkkaYaefRbbhexeka8JheindnaLaecdtg8AfgeclfydbgHaeydbgeSmbaHae9RhgaEaecitfhhaOa8AfhacbhKinahaKcitfydbgXhednindnaLaecdtgCfgeclfydbgHaeydbgeSmbaHae9RhHaEaecitfheaaydbhAdninaOaeydbcdtfydbaASmeaecwfheaHcufgHTmdxbkkcbhexdkaQaCfydbgeaX9hmbkceheka8FaeVh8FaKcefgKag9hmbkkaQa8Afydbgea8J9hmbka8Lcia8FceGEheka8Kae86bbka8Jcefg8Jal9hmbkkdnaqTmbdndnazTmbazheaOhHalhAindnaqaeydbfRbbceGTmbaYaHydbfcl86bbkaeclfheaHclfhHaAcufgAmbxdkkaqheaOhHalhAindnaeRbbceGTmbaYaHydbfcl86bbkaecefheaHclfhHaAcufgAmbkkaOhealhAaYhHindnaYaeydbfRbbcl9hmbaHcl86bbkaeclfheaHcefhHaAcufgAmbkkamceGTmbaYhealhHindnaeRbbce9hmbaecl86bbkaecefheaHcufgHmbkkcbh8Mcualcx2alc;v:Q;v:Qe0Ecbyd1:H:cjbHjjjjbbh8Nasc:Cefasyd;8egecdtfa8NBdbasaecefBd;8eascbBd:qeas9cb83i1ea8Naialavazasc1efz:ejjjbhydndnaDmbcbh8PcbhCxekcbhCawhecbhHindnaeIdbJbbbb9ETmbasaCcdtfaHBdbaCcefhCkaeclfheaDaHcefgH9hmbkcuaCal2gecdtaecFFFFi0Ecbyd1:H:cjbHjjjjbbh8Pasc:Cefasyd;8egecdtfa8PBdbasaecefBd;8ealTmbdnaCmbcbhCxekarcd4hgdnazTmbaCcdthhcbh8Fa8Phainaoaza8Fcdtfydbag2cdtfhKasheaahHaChAinaHaKaeydbcdtgXfIdbawaXfIdbNUdbaeclfheaHclfhHaAcufgAmbkaaahfhaa8Fcefg8Fal9hmbxdkkaCcdthhcbh8Fa8Phainaoa8Fag2cdtfhKasheaahHaChAinaHaKaeydbcdtgXfIdbawaXfIdbNUdbaeclfheaHclfhHaAcufgAmbkaaahfhaa8Fcefg8Fal9hmbkkcualc8S2gHalc;D;O;f8U0EgXcbyd1:H:cjbHjjjjbbheasc:Cefasyd;8egAcdtfaeBdbasaAcefBd;8eaecbaHz:tjjjbhIcbh8RcbhgdnaCTmbcbh8MaXcbyd1:H:cjbHjjjjbbhgasc:Cefasyd;8egecdtfagBdbasaecefBd;8eagcbaHz:tjjjb8AcuaCal2gecltgHaecFFFFb0Ecbyd1:H:cjbHjjjjbbh8Rasc:Cefasyd;8egecdtfa8RBdbasaecefBd;8ea8RcbaHz:tjjjb8AamcjjjjdGTmbcualcltgealcFFFFb0Ecbyd1:H:cjbHjjjjbbh8Masc:Cefasyd;8egHcdtfa8MBdbasaHcefBd;8ea8Mcbaez:tjjjb8AkdnadTmbcbhKabhHina8NaHclfydbg8Fcx2fgeIdba8NaHydbgacx2fgAIdbg8S:tgRa8NaHcwfydbghcx2fgXIdlaAIdlg8U:tg8VNaeIdla8U:tg8WaXIdba8S:tg8XN:tg8Ya8YNa8WaXIdwaAIdwg8Z:tg80NaeIdwa8Z:tg8Wa8VN:tg81a81Na8Wa8XNaRa80N:tg80a80NMMg8V:rhBa8Yh8Xa80h8Wa81hRdna8VJbbbb9EgATmba8YaB:vh8Xa80aB:vh8Wa81aB:vhRkaIaOaacdtfydbgXc8S2fgeaRaB:rg8VaRNNg83aeIdbMUdbaea8Wa8Va8WNgUNg85aeIdlMUdlaea8Xa8Va8XNg86Ng87aeIdwMUdwaeaRaUNgUaeIdxMUdxaea86aRNg88aeIdzMUdzaea8Wa86Ng89aeIdCMUdCaeaRa8Va8Xa8ZNaRa8SNa8Ua8WNMM:mg8:Ng86NgRaeIdKMUdKaea8Wa86Ng8WaeId3MUd3aea8Xa86Ng8XaeIdaMUdaaea86a8:Ng86aeId8KMUd8Kaea8VaeIdyMUdyaIaOa8Fcdtfydbg8Fc8S2fgea83aeIdbMUdbaea85aeIdlMUdlaea87aeIdwMUdwaeaUaeIdxMUdxaea88aeIdzMUdzaea89aeIdCMUdCaeaRaeIdKMUdKaea8WaeId3MUd3aea8XaeIdaMUdaaea86aeId8KMUd8Kaea8VaeIdyMUdyaIaOahcdtfydbgac8S2fgea83aeIdbMUdbaea85aeIdlMUdlaea87aeIdwMUdwaeaUaeIdxMUdxaea88aeIdzMUdzaea89aeIdCMUdCaeaRaeIdKMUdKaea8WaeId3MUd3aea8XaeIdaMUdaaea86aeId8KMUd8Kaea8VaeIdyMUdydna8MTmbdnaATmba8YaB:vh8Ya80aB:vh80a81aB:vh81ka8MaXcltfgeaBJbbbZNgRa80Ng8VaeIdlMUdlaeaRa8YNg8WaeIdwMUdwaeaRa81Ng8XaeIdbMUdbaeaRa8S:ma81Na8Ua80N:ta8Za8YN:tNgRaeIdxMUdxa8Ma8Fcltfgea8VaeIdlMUdlaea8WaeIdwMUdwaea8XaeIdbMUdbaeaRaeIdxMUdxa8Maacltfgea8VaeIdlMUdlaea8WaeIdwMUdwaea8XaeIdbMUdbaeaRaeIdxMUdxkaHcxfhHaKcifgKad6mbkkdnalTmbJq;x8J88J;n;m;m89J:v:;;w8ZamczGEamc;abGEh80cbhHaOhXazhKaIhea8NhAindnaHaXydb9hmbaHh8FdnazTmbaKydbh8Fka80hRdnaqTmbJbbjZa80aqa8FfRbbclGEhRkaecxfg8Fa8FIdbJbbbbMUdbaeczfg8Fa8FIdbJbbbbMUdbaecCfg8Fa8FIdbJbbbbMUdbaeaRaecyfg8FIdbg8YNgRaeIdbMUdbaeclfgaaRaaIdbMUdbaecwfgaaRaaIdbMUdbaecKfgaaaIdbaAIdbg8WaRN:tUdbaAcwfIdbh8Vaec3fgaaaIdbaRaAclfIdbg8XN:tUdbaecafgaaaIdbaRa8VN:tUdbaec8KfgaIdbh81a8Fa8YaRMUdbaaa81aRa8Va8VNa8Wa8WNa8Xa8XNMMNMUdbkaXclfhXaKclfhKaec8SfheaAcxfhAalaHcefgH9hmbkkdnadTmbcbh8Aabhainaba8Acdtfh8FcbhHinaYa8FaHc:G:G:cjbfydbcdtfydbgAfRbbhedndnaYaaaHfydbgXfRbbgKc99fcFeGcpe0mbaec99fcFeGc;:e6mekdnaKcufcFeGce0mba5aXcdtfydbaA9hmekdnaecufcFeGce0mba8EaAcdtfydbaX9hmekJbbacJbbacJbbbZaecFeGceSEaKcFeGceSEhUdna8Na8FaHc:K:G:cjbfydbcdtfydbcx2fgeIdwa8NaXcx2fgKIdwg86:tg8Sa8NaAcx2fghIdwa86:tg8Xa8XNahIdbaKIdbg8U:tg80a80NahIdlaKIdlg8Z:tg8Va8VNMMg81Na8Xa8Sa8XNaeIdba8U:tg83a80Na8VaeIdla8Z:tg85NMMg8WN:tg8Ya8YNa83a81Na80a8WN:tgRaRNa85a81Na8Va8WN:tg8Wa8WNMMgBJbbbb9ETmba8YaB:rgB:vh8Ya8WaB:vh8WaRaB:vhRkaUa81:rNgBa8Ya86NaRa8UNa8Za8WNMM:mg81Ng87a81Nh88a80a85Na8Va83N:tg81a81Na8Va8SNa8Xa85N:tg8Va8VNa8Xa83Na80a8SN:tg8Xa8XNMMg83:rh80a8Ya87Nh85a8Wa87Nh89aRa87Nh87a8WaBa8YNg8SNh8:a8SaRNhZaRaBa8WNgnNhca8Ya8SNh8Ya8WanNh8WaRaBaRNNh8Sdna83Jbbbb9ETmba81a80:vh81a8Xa80:vh8Xa8Va80:vh8VkaIaOaXcdtfydbc8S2fgeaeIdba8Sa8VaUa80:rNgRa8VNNMg80MUdbaea8Wa8XaRa8XNg8SNMg83aeIdlMUdlaea8Ya81aRa81Ng8WNMg8YaeIdwMUdwaeaca8Va8SNMg8SaeIdxMUdxaeaZa8Wa8VNMgUaeIdzMUdzaea8:a8Xa8WNMg8WaeIdCMUdCaea87a8VaRa81a86Na8Va8UNa8Za8XNMMg86:mNgRNMg8VaeIdKMUdKaea89a8XaRNMg8XaeId3MUd3aea85a81aRNMg81aeIdaMUdaaea88a86aRN:tgRaeId8KMUd8KaeaBaeIdyMUdyaIaOaAcdtfydbc8S2fgea80aeIdbMUdbaea83aeIdlMUdlaea8YaeIdwMUdwaea8SaeIdxMUdxaeaUaeIdzMUdzaea8WaeIdCMUdCaea8VaeIdKMUdKaea8XaeId3MUd3aea81aeIdaMUdaaeaRaeId8KMUd8KaeaBaeIdyMUdykaHclfgHcx9hmbkaacxfhaa8Acifg8Aad6mbkaCTmbcbhainJbbbbh80a8Nabaacdtfgeclfydbg8Fcx2fgHIdwa8Naeydbghcx2fgAIdwg8Z:tg8Va8VNaHIdbaAIdbg83:tg8Wa8WNaHIdlaAIdlg85:tg8Xa8XNMMg8Sa8Naecwfydbg8Acx2fgeIdwa8Z:tg8YNa8Va8YNa8WaeIdba83:tg81Na8XaeIdla85:tgBNMMgRa8VN:tJbbbbJbbjZa8Sa8Ya8YNa81a81NaBaBNMMg8UNaRaRN:tg86:va86Jbbbb9BEg86Nh88a8Ua8VNaRa8YN:ta86Nh89a8SaBNaRa8XN:ta86Nh8:a8Ua8XNaRaBN:ta86NhZa8Sa81NaRa8WN:ta86Nhna8Ua8WNaRa81N:ta86Nhca8WaBNa8Xa81N:tgRaRNa8Xa8YNa8VaBN:tgRaRNa8Va81Na8Wa8YN:tgRaRNMM:rJbbbZNhRa8PahaC2g8JcdtfhHa8Pa8AaC2gDcdtfhAa8Pa8FaC2g8KcdtfhXa8Z:mh9ca85:mhJa83:mh9eascjdfheaChKJbbbbhBJbbbbh86Jbbbbh8SJbbbbh8UJbbbbh8ZJbbbbh83Jbbbbh85Jbbbbh87JbbbbhUinaecwfaRa89aXIdbaHIdbg8Y:tg8XNa88aAIdba8Y:tg81NMg8VNUdbaeclfaRaZa8XNa8:a81NMg8WNUdbaeaRaca8XNana81NMg8XNUdbaecxfaRa9ca8VNaJa8WNa8Ya9ea8XNMMMg8YNUdbaRa8Va8WNNa8ZMh8ZaRa8Va8XNNa8UMh8UaRa8Wa8XNNa8SMh8SaRa8Ya8YNNaUMhUaRa8Va8YNNa87Mh87aRa8Wa8YNNa85Mh85aRa8Xa8YNNa83Mh83aRa8Va8VNNa86Mh86aRa8Wa8WNNaBMhBaRa8Xa8XNNa80Mh80aHclfhHaXclfhXaAclfhAaeczfheaKcufgKmbkagahc8S2fgea80aeIdbMUdbaeaBaeIdlMUdlaea86aeIdwMUdwaea8SaeIdxMUdxaea8UaeIdzMUdzaea8ZaeIdCMUdCaea83aeIdKMUdKaea85aeId3MUd3aea87aeIdaMUdaaeaUaeId8KMUd8KaeaRaeIdyMUdyaga8Fc8S2fgea80aeIdbMUdbaeaBaeIdlMUdlaea86aeIdwMUdwaea8SaeIdxMUdxaea8UaeIdzMUdzaea8ZaeIdCMUdCaea83aeIdKMUdKaea85aeId3MUd3aea87aeIdaMUdaaeaUaeId8KMUd8KaeaRaeIdyMUdyaga8Ac8S2fgea80aeIdbMUdbaeaBaeIdlMUdlaea86aeIdwMUdwaea8SaeIdxMUdxaea8UaeIdzMUdzaea8ZaeIdCMUdCaea83aeIdKMUdKaea85aeId3MUd3aea87aeIdaMUdaaeaUaeId8KMUd8KaeaRaeIdyMUdya8Ra8Jcltfh8FcbhHaChXina8FaHfgeascjdfaHfgAIdbaeIdbMUdbaeclfgKaAclfIdbaKIdbMUdbaecwfgKaAcwfIdbaKIdbMUdbaecxfgeaAcxfIdbaeIdbMUdbaHczfhHaXcufgXmbka8Ra8Kcltfh8FcbhHaChXina8FaHfgeascjdfaHfgAIdbaeIdbMUdbaeclfgKaAclfIdbaKIdbMUdbaecwfgKaAcwfIdbaKIdbMUdbaecxfgeaAcxfIdbaeIdbMUdbaHczfhHaXcufgXmbka8RaDcltfh8FcbhHaChXina8FaHfgeascjdfaHfgAIdbaeIdbMUdbaeclfgKaAclfIdbaKIdbMUdbaecwfgKaAcwfIdbaKIdbMUdbaecxfgeaAcxfIdbaeIdbMUdbaHczfhHaXcufgXmbkaacifgaad6mbkkcbhAdndnamcwGgTmbJbbbbh8ScbhScbh9hcbh9ixekcbhSa3cbyd1:H:cjbHjjjjbbh9iasc:Cefasyd;8egecdtfa9iBdbasaecefBd;8ecua9ialabadaOz:fjjjbgXcltaXcjjjjiGEcbyd1:H:cjbHjjjjbbh9hasc:Cefasyd;8egecdtfa9hBdbasaecefBd;8ea9haXa9ia8Nalz:gjjjbJFFuuh8SaXTmba9hheaXhHinaeIdbgRa8Sa8SaR9EEh8SaeclfheaHcufgHmbkaXhSkdnalTmbaLclfheaLydbhXaYhHalhKcbhAincbaeydbg8FaX9RaHRbbcpeGEaAfhAaHcefhHaeclfhea8FhXaKcufgKmbkaAce4hAkcuadaA9Rcifg6cx2a6c;v:Q;v:Qe0Ecbyd1:H:cjbHjjjjbbh9kasc:Cefasyd;8egecdtfa9kBdbasaecefBd;8ecua6cdta6cFFFFi0Ecbyd1:H:cjbHjjjjbbh0asc:Cefasyd;8egecdtfa0BdbasaecefBd;8ea3cbyd1:H:cjbHjjjjbbh9masc:Cefasyd;8egecdtfa9mBdbasaecefBd;8ealcbyd1:H:cjbHjjjjbbh9nasc:Cefasyd;8egecdtfa9nBdbasaecefBd;8eaxaxNayJbbjZamclGEgZaZN:vh87JbbbbhUdnadak9nmbdna6ci6mbaCclth9oa9kcwfh9pJbbbbh85JbbbbhUinascNefabadalaOz:cjjjbabh8Acbh9qcbh9rinaba9rcdtfhDcbheindnaOa8AaefydbgAcdtghfydbgXaOaDaec:W:G:cjbfydbcdtfydbgHcdtg8JfydbgKSmbaYaHfRbbgacv2aYaAfRbbg8FfRb;a:G:cjbg8La8Fcv2aafg8KRb;a:G:cjbg3VcFeGTmbdnaKaX9nmba8KRb;G:G:cjbcFeGmekdna8FcufcFeGce0mbaaTmba5ahfydbaH9hmekdna8FTmbaacufcFeGce0mba8Ea8JfydbaA9hmeka9ka9qcx2fgXaHaAa3cFeGgKEBdlaXaAaHaKEBdbaXaKa8LGcb9hBdwa9qcefh9qkaeclfgecx9hmbkdna9rcifg9rad9pmba8Acxfh8Aa9qcifa69nmekka9qTmdcbh8KinaIaOa9ka8Kcx2fghydbgKcdtgXfydbg8Ac8S2fgeIdwa8Nahydlg8Fcx2fgHIdwg8WNaeIdzaHIdbg8XNaeIdaMgRaRMMa8WNaeIdlaHIdlg8YNaeIdCa8WNaeId3MgRaRMMa8YNaeIdba8XNaeIdxa8YNaeIdKMgRaRMMa8XNaeId8KMMM:lhRJbbbbJbbjZaeIdyg8V:va8VJbbbb9BEh8VdndnahydwgDmbJFFuuh86xekJbbbbJbbjZaIaOa8Fcdtfydbc8S2fgeIdyg81:va81Jbbbb9BEaeIdwa8NaKcx2fgHIdwg81NaeIdzaHIdbg80NaeIdaMgBaBMMa81NaeIdlaHIdlgBNaeIdCa81NaeId3Mg81a81MMaBNaeIdba80NaeIdxaBNaeIdKMg81a81MMa80NaeId8KMMM:lNh86ka8VaRNhBdnaCTmbagaKc8S2fgAIdwa8WNaAIdza8XNaAIdaMgRaRMMa8WNaAIdla8YNaAIdCa8WNaAId3MgRaRMMa8YNaAIdba8XNaAIdxa8YNaAIdKMgRaRMMa8XNaAId8KMMMhRa8Pa8FaC2gacdtfhHa8RaKaC2g8JcltfheaAIdyh81aChAinaHIdbg8Va8Va81NaecxfIdba8WaecwfIdbNa8XaeIdbNa8YaeclfIdbNMMMg8Va8VM:tNaRMhRaHclfhHaeczfheaAcufgAmbkdndnaDmbJbbbbh8Vxekaga8Fc8S2fgAIdwa8NaKcx2fgeIdwg8XNaAIdzaeIdbg8YNaAIdaMg8Va8VMMa8XNaAIdlaeIdlg81NaAIdCa8XNaAId3Mg8Va8VMMa81NaAIdba8YNaAIdxa81NaAIdKMg8Va8VMMa8YNaAId8KMMMh8Va8Pa8JcdtfhHa8RaacltfheaAIdyh80aChAinaHIdbg8Wa8Wa80NaecxfIdba8XaecwfIdbNa8YaeIdbNa81aeclfIdbNMMMg8Wa8WM:tNa8VMh8VaHclfhHaeczfheaAcufgAmbka8V:lh8VkaBaR:lMhBa86a8VMh86dndndnaYaKfRbbc9:fPddbekaQaXfydbgXaKSmbaOa8Fcdtfydbh8Jindndna5aXcdtgafydbgecuSmbaOaecdtfydba8JSmekdna8EaafydbgecuSmbaOaecdtfydba8JSmeka8FhekagaXc8S2fgAIdwa8Naecx2fgHIdwg8WNaAIdzaHIdbg8XNaAIdaMgRaRMMa8WNaAIdlaHIdlg8YNaAIdCa8WNaAId3MgRaRMMa8YNaAIdba8XNaAIdxa8YNaAIdKMgRaRMMa8XNaAId8KMMMhRa8PaeaC2cdtfhHa8RaXaC2cltfheaAIdyh81aChAinaHIdbg8Va8Va81NaecxfIdba8WaecwfIdbNa8XaeIdbNa8YaeclfIdbNMMMg8Va8VM:tNaRMhRaHclfhHaeczfheaAcufgAmbkaBaR:lMhBaQaafydbgXaK9hmbkkaYa8FfRbbci9hmeaDTmeaQa8FcdtfydbgXa8FSmeindndna5aXcdtgafydbgecuSmbaOaecdtfydba8ASmekdna8EaafydbgecuSmbaOaecdtfydba8ASmekaKhekagaXc8S2fgAIdwa8Naecx2fgHIdwg8WNaAIdzaHIdbg8XNaAIdaMgRaRMMa8WNaAIdlaHIdlg8YNaAIdCa8WNaAId3MgRaRMMa8YNaAIdba8XNaAIdxa8YNaAIdKMgRaRMMa8XNaAId8KMMMhRa8PaeaC2cdtfhHa8RaXaC2cltfheaAIdyh81aChAinaHIdbg8Va8Va81NaecxfIdba8WaecwfIdbNa8XaeIdbNa8YaeclfIdbNMMMg8Va8VM:tNaRMhRaHclfhHaeczfheaAcufgAmbka86aR:lMh86aQaafydbgXa8F9hmbxdkkdna8Ea5a5aXfydba8FSEaQaXfydbgacdtfydbgXcu9hmbaQa8FcdtfydbhXkagaac8S2fgAIdwa8NaXcx2fgeIdwg8WNaAIdzaeIdbg8XNaAIdaMgRaRMMa8WNaAIdlaeIdlg8YNaAIdCa8WNaAId3MgRaRMMa8YNaAIdba8XNaAIdxa8YNaAIdKMgRaRMMa8XNaAId8KMMMhRa8PaXaC2g8AcdtfhHa8RaaaC2g8JcltfheaAIdyh81aChAinaHIdbg8Va8Va81NaecxfIdba8WaecwfIdbNa8XaeIdbNa8YaeclfIdbNMMMg8Va8VM:tNaRMhRaHclfhHaeczfheaAcufgAmbkdndnaDmbJbbbbh8VxekagaXc8S2fgAIdwa8Naacx2fgeIdwg8XNaAIdzaeIdbg8YNaAIdaMg8Va8VMMa8XNaAIdlaeIdlg81NaAIdCa8XNaAId3Mg8Va8VMMa81NaAIdba8YNaAIdxa81NaAIdKMg8Va8VMMa8YNaAId8KMMMh8Va8Pa8JcdtfhHa8Ra8AcltfheaAIdyh80aChAinaHIdbg8Wa8Wa80NaecxfIdba8XaecwfIdbNa8YaeIdbNa81aeclfIdbNMMMg8Wa8WM:tNa8VMh8VaHclfhHaeczfheaAcufgAmbka8V:lh8VkaBaR:lMhBa86a8VMh86kaha86aBa86aB9DgeEUdwahaKa8FaeaDcb9hGgeEBdlaha8FaKaeEBdba8Kcefg8Ka9q9hmbkascjdfcbcj;qbz:tjjjb8Aa9phea9qhHinascjdfaeydbcA4cF8FGgAcFAaAcFA6EcdtfgAaAydbcefBdbaecxfheaHcufgHmbkcbhecbhHinascjdfaefgAydbhXaAaHBdbaXaHfhHaeclfgecj;qb9hmbkcbhea9phHinascjdfaHydbcA4cF8FGgAcFAaAcFA6EcdtfgAaAydbgAcefBdba0aAcdtfaeBdbaHcxfhHa9qaecefge9hmbkadak9RgAci9Uh9sdnalTmbcbhea9mhHinaHaeBdbaHclfhHalaecefge9hmbkkcbh9ta9ncbalz:tjjjbh3aAcO9Uh9ua9sce4h9rcbh8Lcbh8Kdnina9ka0a8Kcdtfydbcx2fg8JIdwgRa879Emea8La9s9pmeJFFuuh8Vdna9ra9q9pmba9ka0a9rcdtfydbcx2fIdwJbb;aZNh8VkdnaRa8V9ETmbaRaU9ETmba8La9u0mdkdna3aOa8JydlgDcdtg9vfg8AydbgAfg9wRbba3aOa8Jydbghcdtg9xfydbgefg9yRbbVmbaYahfRbbh9zdndnaLaecdtfgHclfydbgXaHydbgHSmbaXaH9RhXa8NaAcx2fh8Fa8Naecx2fhaaEaHcitfheindna9maeydbcdtfydbgHaASmba9maeclfydbcdtfydbgKaASmbaHaKSmba8NaKcx2fgKIdba8NaHcx2fgHIdbg8W:tgRaaIdlaHIdlg8X:tg80NaKIdla8X:tg8VaaIdba8W:tgBN:tg8YaRa8FIdla8X:tg86Na8Va8FIdba8W:tg8UN:tg8XNa8VaaIdwaHIdwg81:tg8ZNaKIdwa81:tg8Wa80N:tg80a8Va8FIdwa81:tg83Na8Wa86N:tg8VNa8WaBNaRa8ZN:tg81a8Wa8UNaRa83N:tgRNMMa8Ya8YNa80a80Na81a81NMMa8Xa8XNa8Va8VNaRaRNMMN:rJbbj8:N9FmikaecwfheaXcufgXmbkkdndndndna9zc9:fPdebdkahheina8AydbhAdndna5aecdtgHfydbgecuSmbaOaecdtfydbaASmekdna8EaHfydbgecuSmbaOaecdtfydbaASmekaDheka9maHfaeBdbaQaHfydbgeah9hmbxikkdna8Ea5a5a9xfydbaDSEaQa9xfydbghcdtfydbgecu9hmbaQa9vfydbheka9ma9xfaDBdbaehDka9mahcdtfaDBdbka9yce86bba9wce86bba8JIdwgRaUaUaR9DEhUa9tcefh9tcecda9zceSEa8Lfh8Lxeka9rcefh9rka8Kcefg8Ka9q9hmbkka9tTmddnalTmbcbh8Fcbhhindna9mahcdtgefydbgAahSmbaOaAcdtfydbh8AdnahaOaefydb9hg8JmbaIa8Ac8S2fgeaIahc8S2fgHIdbaeIdbMUdbaeaHIdlaeIdlMUdlaeaHIdwaeIdwMUdwaeaHIdxaeIdxMUdxaeaHIdzaeIdzMUdzaeaHIdCaeIdCMUdCaeaHIdKaeIdKMUdKaeaHId3aeId3MUd3aeaHIdaaeIdaMUdaaeaHId8KaeId8KMUd8KaeaHIdyaeIdyMUdya8MTmba8Ma8Acltfgea8MahcltfgHIdbaeIdbMUdbaeaHIdlaeIdlMUdlaeaHIdwaeIdwMUdwaeaHIdxaeIdxMUdxkaCTmbagaAc8S2fgeagahc8S2gDfgHIdbaeIdbMUdbaeaHIdlaeIdlMUdlaeaHIdwaeIdwMUdwaeaHIdxaeIdxMUdxaeaHIdzaeIdzMUdzaeaHIdCaeIdCMUdCaeaHIdKaeIdKMUdKaeaHId3aeId3MUd3aeaHIdaaeIdaMUdaaeaHId8KaeId8KMUd8KaeaHIdyaeIdyMUdya9oaA2haa8RhHaChXinaHaafgeaHa8FfgAIdbaeIdbMUdbaeclfgKaAclfIdbaKIdbMUdbaecwfgKaAcwfIdbaKIdbMUdbaecxfgeaAcxfIdbaeIdbMUdbaHczfhHaXcufgXmbka8JmbJbbbbJbbjZaIaDfgeIdygR:vaRJbbbb9BEaeIdwa8Na8Acx2fgHIdwgRNaeIdzaHIdbg8VNaeIdaMg8Wa8WMMaRNaeIdlaHIdlg8WNaeIdCaRNaeId3MgRaRMMa8WNaeIdba8VNaeIdxa8WNaeIdKMgRaRMMa8VNaeId8KMMM:lNgRa85a85aR9DEh85ka8Fa9ofh8Fahcefghal9hmbkcbhHa5heindnaeydbgAcuSmbdnaHa9maAcdtgXfydbgA9hmbcuhAa5aXfydbgXcuSmba9maXcdtfydbhAkaeaABdbkaeclfhealaHcefgH9hmbkcbhHa8EheindnaeydbgAcuSmbdnaHa9maAcdtgXfydbgA9hmbcuhAa8EaXfydbgXcuSmba9maXcdtfydbhAkaeaABdbkaeclfhealaHcefgH9hmbkka85aUaCEh85cbhHabhecbhAindnaOa9maeydbcdtfydbg8FcdtfydbgXaOa9maeclfydbcdtfydbgacdtfydbgKSmbaXaOa9maecwfydbcdtfydbg8AcdtfydbghSmbaKahSmbabaHcdtfgXa8FBdbaXcwfa8ABdbaXclfaaBdbaHcifhHkaecxfheaAcifgAad6mbkdndnaTmbaHhdxekdnaHak0mbaHhdxekdna8Sa859FmbaHhdxekJFFuuh8ScbhdabhecbhAindna9ha9iaeydbgXcdtfydbcdtfIdbgRa859ETmbaeclf8Pdbh9AabadcdtfgKaXBdbaKclfa9A83dbaRa8Sa8SaR9EEh8SadcifhdkaecxfheaAcifgAaH6mbkkadak0mbxdkkascNefabadalaOz:cjjjbkdndnadak0mbadhaxekdnaTmbadhaxekdna8Sa879FmbadhaxekcehKina8SJbb;aZNgRa87aRa879DEh8WJbbbbhRdnaSTmba9hheaShHinaeIdbg8VaRa8Va8W9FEaRa8VaR9EEhRaeclfheaHcufgHmbkkJFFuuh8ScbhaabhecbhHindna9ha9iaeydbgAcdtfydbcdtfIdbg8Va8W9ETmbaeclf8Pdbh9AabaacdtfgXaABdbaXclfa9A83dba8Va8Sa8Sa8V9EEh8SaacifhakaecxfheaHcifgHad6mbkdnaKaaad9hVceGmbadhaxdkaRaUaUaR9DEhUaaak9nmecbhKaahda8Sa879FmbkkdnamcjjjjdGTmba9ncbalz:tjjjbh8AdnaaTmbabheaahHina8AaeydbgAfce86bba8AaOaAcdtfydbfce86bbaeclfheaHcufgHmbkkascNefabaaalaOz:cjjjbdndnalTmbcbhXindna8AaXfRbbTmbdnaYaXfRbbgecl0mbceaetcQGmekdnaOaXcdtg8FfydbgeaXSmba8NaXcx2fgHa8Naecx2fgeydwBdwaHae8Pdb83dbxekaIaXc8S2fgKIdygcacJL:3;rUNgRMh87aKIdwg9BaRMh8SaKIdlg9CaRMh8UaKIdbg9DaRMh81aKIdag9EaRa8NaXcx2fg8JIdwg88N:th8ZaKId3g9FaRa8JIdlg89N:th83aKIdKg9Ga8JIdbg8:aRN:th80JbbbbhnaKIdCg9HJbbbbMh85aKIdzg9IJbbbbMhBaKIdxg9JJbbbbMh86dndnaCTmbaXhAinJbbbba87agaAc8S2fgHIdygR:vaRJbbbb9BEhRa8RaAaC2cltfheaHIdaa87Na8ZMh8ZaHId3a87Na83Mh83aHIdKa87Na80Mh80aHIdCa87Na85Mh85aHIdza87NaBMhBaHIdxa87Na86Mh86aHIdwa87Na8SMh8SaHIdla87Na8UMh8UaHIdba87Na81Mh81aChHina8ZaecwfIdbg8VaecxfIdbg8YNaRN:th8Za83aeclfIdbg8Wa8YNaRN:th83a85a8Wa8VNaRN:th85a81aeIdbg8Xa8XNaRN:th81a80a8Xa8YNaRN:th80aBa8Xa8VNaRN:thBa86a8Xa8WNaRN:th86a8Sa8Va8VNaRN:th8Sa8Ua8Wa8WNaRN:th8UaeczfheaHcufgHmbkaQaAcdtfydbgAaX9hmbka8MTmba8MaXcltfgeIdxhxaeIdwh9caeIdlhJaeIdbhRxekJbbbbhxJbbbbh9cJbbbbhJJbbbbhRkaBa81:vg8Wa80Na8Z:ta85aBa86a81:vg8VN:tg8Za8Ua86a8VN:tg8Y:vg8Xa8Va80Na83:tg8UN:th83a9caRa8WN:taJaRa8VN:tg86a8XN:tg85a8SaBa8WN:ta8Za8XN:tgB:vg8S:mh8Za86a8Y:vg9c:mhJdnJbbbbaRaRa81:vg9eN:ta86a9cN:ta85a8SN:tg86:la87J:983:g81NgR9ETmba8Za83NaJa8UNa9ea80Nax:tMMa86:vhnka81:laR9ETmba8Y:laR9ETmbaB:laR9ETmba9e:manNa8W:ma8ZanNa83aB:vMgBNa8V:maJanNa8X:maBNa8Ua8Y:vMMg85Na80:ma81:vMMMh87aLa8FfgeclfydbgHaeydbge9RhhaEaecitfh8FJbbbbhRdnaHaeSgDmbJbbbbhRa8FheahhAina8Naeclfydbcx2fgHIdwa88:tg8Va8VNaHIdba8::tg8Va8VNaHIdla89:tg8Va8VNMMg8Va8Naeydbcx2fgHIdwa88:tg8Wa8WNaHIdba8::tg8Wa8WNaHIdla89:tg8Wa8WNMMg8WaRaRa8W9DEgRaRa8V9DEhRaecwfheaAcufgAmbkaR:rgRaRNhRkaBa88:tg8Va8VNa87a8::tg8Va8VNa85a89:tg8Va8VNMMaR9EmbaKId8KhndnaDmbina8Na8Fclfydbcx2fgeIdba8Na8Fydbcx2fgHIdbg8W:tgRa89aHIdlg8X:tg80NaeIdla8X:tg8Va8:a8W:tg86N:tg8YaRa85a8X:tg8SNa8Va87a8W:tg8UN:tg8XNa8Va88aHIdwg81:tg8ZNaeIdwa81:tg8Wa80N:tg80a8VaBa81:tg83Na8Wa8SN:tg8VNa8Wa86NaRa8ZN:tg81a8Wa8UNaRa83N:tgRNMMa8Ya8YNa80a80Na81a81NMMa8Xa8XNa8Va8VNaRaRNMMN:rJbbj8:N9Fmda8Fcwfh8FahcufghmbkkJbbbbJbbjZac:vacJbbbb9BEgRa9BaBNa9Ia87Na9EMg8Va8VMMaBNa9Ca85Na9HaBNa9FMg8Va8VMMa85Na9Da87Na9Ja85Na9GMg8Va8VMMa87NanMMM:lNaRa9Ba88Na9Ia8:Na9EMg8Va8VMMa88Na9Ca89Na9Ha88Na9FMg8Va8VMMa89Na9Da8:Na9Ja89Na9GMg8Va8VMMa8:NanMMM:lNJbb;aZNJ:983:g81M9Emba8JaBUdwa8Ja85Udla8Ja87UdbkaXcefgXal9hmbkdnaCmbcbhCxdkcbhXindna8AaXfRbbTmbaOaXcdtgefydbaX9hmbaYaXfhhaQaefh8Ja8NaXcx2fhAa8PaXaC2cdtfhDcbhEincuhLdnahRbbci9hmbaXhLa8JydbgeaXSmba8PaEcdtgHfhKaDaHfIdbhRaXhLinaLhHcuhLdnaKaeaC2cdtfIdbaR9CmbaHcuSmbaHhLagaec8S2fIdyagaHc8S2fIdy9ETmbaehLkaQaecdtfydbgeaX9hmbkka8PaEcdtfhKa8RaEcltfh8FaXheinaKaeaC2cdtfJbbbbJbbjZagaeaLaLcuSEgHc8S2fIdygR:vaRJbbbb9BEa8FaHaC2cltfgHIdwaAIdwNaHIdbaAIdbNaHIdlaAIdlNMMaHIdxMNUdbaQaecdtfydbgeaX9hmbkaEcefgEaC9hmbkkaXcefgXal9hmbxdkkaCmbcbhCkaiavaoarawaCala8Na8Pazasayasc1efaYa8Aaqz:hjjjbkdnamcjjjjlGTmbazmbaaTmbabhecbhLinaYaeydbgAfRbbc3thQaecwfgXydbhHcjjjj94hCdna5aAcdtgEfydbaeclfgKydbgOSmbcjjjj94cba8EaOcdtfydbaASEhCkaeaQaCVaAVBdbaYaOfRbbc3th8Fcjjjj94hCcjjjj94hQdna5aOcdtfydbaHSmbcjjjj94cba8EaHcdtfydbaOSEhQkaKa8FaQVaOVBdbaYaHfRbbc3thOdna5aHcdtfydbaASmbcjjjj94cba8EaEfydbaHSEhCkaXaOaCVaHVBdbaecxfheaLcifgLaa6mbkkdnazTmbaaTmbaaheinabazabydbcdtfydbBdbabclfhbaecufgembkkdnaPTmbaPaZaU:rNUdbkdnasyd;8egHTmbaHcdtasc:Ceffc98fheinaeydbcbyd:m:H:cjbH:bjjjbbaec98fheaHcufgHmbkkascj;sbf8Kjjjjbaak;Yieouabydlhvabydbclfcbaicdtz:tjjjbhoadci9UhrdnadTmbdnalTmbaehwadhDinaoalawydbcdtfydbcdtfgqaqydbcefBdbawclfhwaDcufgDmbxdkkaehwadhDinaoawydbcdtfgqaqydbcefBdbawclfhwaDcufgDmbkkdnaiTmbcbhDaohwinawydbhqawaDBdbawclfhwaqaDfhDaicufgimbkkdnadci6mbinaecwfydbhwaeclfydbhDaeydbhidnalTmbalawcdtfydbhwalaDcdtfydbhDalaicdtfydbhikavaoaicdtfgqydbcitfaDBdbavaqydbcitfawBdlaqaqydbcefBdbavaoaDcdtfgqydbcitfawBdbavaqydbcitfaiBdlaqaqydbcefBdbavaoawcdtfgwydbcitfaiBdbavawydbcitfaDBdlawawydbcefBdbaecxfhearcufgrmbkkabydbcbBdbk:todDue99aicd4aifhrcehwinawgDcethwaDar6mbkcuaDcdtgraDcFFFFi0Ecbyd1:H:cjbHjjjjbbhwaoaoyd9GgqcefBd9GaoaqcdtfawBdbawcFearz:tjjjbhkdnaiTmbalcd4hlaDcufhxcbhminamhDdnavTmbavamcdtfydbhDkcbadaDal2cdtfgDydlgwawcjjjj94SEgwcH4aw7c:F:b:DD2cbaDydbgwawcjjjj94SEgwcH4aw7c;D;O:B8J27cbaDydwgDaDcjjjj94SEgDcH4aD7c:3F;N8N27axGhwamcdthPdndndnavTmbakawcdtfgrydbgDcuSmeadavaPfydbal2cdtfgsIdbhzcehqinaqhrdnadavaDcdtfydbal2cdtfgqIdbaz9CmbaqIdlasIdl9CmbaqIdwasIdw9BmlkarcefhqakawarfaxGgwcdtfgrydbgDcu9hmbxdkkakawcdtfgrydbgDcuSmbadamal2cdtfgsIdbhzcehqinaqhrdnadaDal2cdtfgqIdbaz9CmbaqIdlasIdl9CmbaqIdwasIdw9BmikarcefhqakawarfaxGgwcdtfgrydbgDcu9hmbkkaramBdbamhDkabaPfaDBdbamcefgmai9hmbkkakcbyd:m:H:cjbH:bjjjbbaoaoyd9GcufBd9GdnaeTmbaiTmbcbhDaehwinawaDBdbawclfhwaiaDcefgD9hmbkcbhDaehwindnaDabydbgrSmbawaearcdtfgrydbBdbaraDBdbkabclfhbawclfhwaiaDcefgD9hmbkkk;:odvuv998Jjjjjbca9Rgocbyd1:G:cjbBdKaocb8Pdj:G:cjb83izaocbydN:G:cjbBdwaocb8Pd:m:G:cjb83ibdnadTmbaicd4hrdnabmbdnalTmbcbhwinaealawcdtfydbar2cdtfhDcbhiinaoczfaifgqaDaifIdbgkaqIdbgxaxak9EEUdbaoaifgqakaqIdbgxaxak9DEUdbaiclfgicx9hmbkawcefgwad9hmbxikkarcdthwcbhDincbhiinaoczfaifgqaeaifIdbgkaqIdbgxaxak9EEUdbaoaifgqakaqIdbgxaxak9DEUdbaiclfgicx9hmbkaeawfheaDcefgDad9hmbxdkkdnalTmbcbhwinabawcx2fgiaealawcdtfydbar2cdtfgDIdbUdbaiaDIdlUdlaiaDIdwUdwcbhiinaoczfaifgqaDaifIdbgkaqIdbgxaxak9EEUdbaoaifgqakaqIdbgxaxak9DEUdbaiclfgicx9hmbkawcefgwad9hmbxdkkarcdthlcbhwaehDinabawcx2fgiaeawar2cdtfgqIdbUdbaiaqIdlUdlaiaqIdwUdwcbhiinaoczfaifgqaDaifIdbgkaqIdbgxaxak9EEUdbaoaifgqakaqIdbgxaxak9DEUdbaiclfgicx9hmbkaDalfhDawcefgwad9hmbkkJbbbbaoIdbaoIdzgx:tgkakJbbbb9DEgkaoIdlaoIdCgm:tgPaPak9DEgkaoIdwaoIdKgP:tgsasak9DEhsdnabTmbadTmbJbbbbJbbjZas:vasJbbbb9BEhkinabakabIdbax:tNUdbabclfgoakaoIdbam:tNUdbabcwfgoakaoIdbaP:tNUdbabcxfhbadcufgdmbkkdnavTmbavaPUdwavamUdlavaxUdbkask:WlewudnaeTmbcbhvabhoinaoavBdbaoclfhoaeavcefgv9hmbkkdnaiTmbcbhrinadarcdtfhwcbhDinalawaDcdtgvyd:G:G:cjbcdtfydbcdtfydbhodnalawavfydbcdtfydbgqabaqcdtfgkydbgvSmbinakabavgqcdtfgxydbgvBdbaxhkaqav9hmbkkdnaoabaocdtfgkydbgvSmbinakabavgocdtfgxydbgvBdbaxhkaoav9hmbkkdnaqaoSmbabaqaoaqao0Ecdtfaqaoaqao6EBdbkaDcefgDci9hmbkarcifgrai6mbkkdnaembcbskcbhxindnalaxcdtgvfydbax9hmbaxhodnaxabavfgDydbgvSmbaDhqinaqabavgocdtfgkydbgvBdbakhqaoav9hmbkkaDaoBdbkaxcefgxae9hmbkcbhkabhvcbhoindndnaoalydbgq9hmbdnaoavydbgq9hmbavakBdbakcefhkxdkavabaqcdtfydbBdbxekavabaqcdtfydbBdbkalclfhlavclfhvaeaocefgo9hmbkakk;jiilud99euabcbaecltz:tjjjbhvdnalTmbadhoaihralhwinarcwfIdbhDarclfIdbhqavaoydbcltfgkarIdbakIdbMUdbakaqakIdlMUdlakaDakIdwMUdwakakIdxJbbjZMUdxaoclfhoarcxfhrawcufgwmbkkdnaeTmbavhkaehrinakcxfgoIdbhDaocbBdbakakIdbJbbbbJbbjZaD:vaDJbbbb9BEgDNUdbakclfgoaDaoIdbNUdbakcwfgoaDaoIdbNUdbakczfhkarcufgrmbkkdnalTmbinavadydbcltfgkaicwfIdbakIdw:tgDaDNaiIdbakIdb:tgDaDNaiclfIdbakIdl:tgDaDNMMgDakIdxgqaqaD9DEUdxadclfhdaicxfhialcufglmbkkdnaeTmbavcxfhkinabakIdbUdbakczfhkabclfhbaecufgembkkk:moerudnaoTmbaecd4hzdnavTmbaicd4hHavcdthOcbhAindnaPaAfRbbTmbaAhednaDTmbaDaAcdtfydbhekdnasTmbasaefRbbceGmekdnamaAfRbbclSmbabaeaz2cdtfgiaraAcx2fgCIdbakNaxIdbMUdbaiaCIdlakNaxIdlMUdlaiaCIdwakNaxIdwMUdwkadaeaH2cdtfhXaqheawhiavhCinaXaeydbcdtgQfaiIdbalaQfIdb:vUdbaeclfheaiclfhiaCcufgCmbkkawaOfhwaAcefgAao9hmbxdkkdnasmbcbheaDhiindnaPaefRbbTmbaehCdnaDTmbaiydbhCkamaefRbbclSmbabaCaz2cdtfgCarIdbakNaxIdbMUdbaCarclfIdbakNaxIdlMUdlaCarcwfIdbakNaxIdwMUdwkaiclfhiarcxfhraoaecefge9hmbxdkkdnaDTmbindnaPRbbTmbasaDydbgefRbbceGmbamRbbclSmbabaeaz2cdtfgearIdbakNaxIdbMUdbaearclfIdbakNaxIdlMUdlaearcwfIdbakNaxIdwMUdwkaPcefhPaDclfhDamcefhmarcxfhraocufgombxdkkazcdthicbheindnaPaefRbbTmbasaefRbbceGmbamaefRbbclSmbabarIdbakNaxIdbMUdbabclfarclfIdbakNaxIdlMUdbabcwfarcwfIdbakNaxIdwMUdbkarcxfhrabaifhbaoaecefge9hmbkkk8MbabaeadaialavcbcbcbcbcbaoarawaDz:bjjjbk8MbabaeadaialavaoarawaDaqakaxamaPz:bjjjbkRbababaeadaialavaoarawaDaqakaxcjjjjdVamz:bjjjbk:g8Koque99due99duq998Jjjjjbc;Wb9Rgq8Kjjjjbcbhkaqcxfcbc;Kbz:tjjjb8Aaqcualcx2alc;v:Q;v:Qe0Ecbyd1:H:cjbHjjjjbbgxBdxaqceBd2axaialavcbcbz:ejjjb8AaqcualcdtalcFFFFi0Egmcbyd1:H:cjbHjjjjbbgiBdzaqcdBd2dndnJFF959eJbbjZawJbbjZawJbbjZ9DE:vawJ9VO:d869DEgw:lJbbb9p9DTmbaw:OhPxekcjjjj94hPkadci9Uhsarco9UhzdndnaombaPcd9imekdnalTmbaPcuf:YhwdnaoTmbcbhvaihHaxhOindndnaoavfRbbceGTmbavcjjjjlVhAxekdndnaOclfIdbawNJbbbZMgC:lJbbb9p9DTmbaC:OhAxekcjjjj94hAkaAcqthAdndnaOcwfIdbawNJbbbZMgC:lJbbb9p9DTmbaC:OhXxekcjjjj94hXkaAaXVhAdndnaOIdbawNJbbbZMgC:lJbbb9p9DTmbaC:OhXxekcjjjj94hXkaAaXcCtVhAkaHaABdbaHclfhHaOcxfhOalavcefgv9hmbxdkkaxhvaihOalhHindndnavIdbawNJbbbZMgC:lJbbb9p9DTmbaC:OhAxekcjjjj94hAkaAcCthAdndnavclfIdbawNJbbbZMgC:lJbbb9p9DTmbaC:OhXxekcjjjj94hXkaXcqtaAVhAdndnavcwfIdbawNJbbbZMgC:lJbbb9p9DTmbaC:OhXxekcjjjj94hXkaOaAaXVBdbavcxfhvaOclfhOaHcufgHmbkkadTmbcbhkaehvcbhOinakaiavclfydbcdtfydbgHaiavcwfydbcdtfydbgA9haiavydbcdtfydbgXaH9haXaA9hGGfhkavcxfhvaOcifgOad6mbkkarci9UhQdndnaz:Z:rJbbbZMgw:lJbbb9p9DTmbaw:Ohvxekcjjjj94hvkaQ:ZhLcbhKc:bwhzdninakaQ9pmeazaP9Rcd9imeavazcufgOavaO9iEaPcefavaP9kEhYdnalTmbaYcuf:YhwdnaoTmbcbhOaihHaxhvindndnaoaOfRbbceGTmbaOcjjjjlVhAxekdndnavclfIdbawNJbbbZMgC:lJbbb9p9DTmbaC:OhAxekcjjjj94hAkaAcqthAdndnavcwfIdbawNJbbbZMgC:lJbbb9p9DTmbaC:OhXxekcjjjj94hXkaAaXVhAdndnavIdbawNJbbbZMgC:lJbbb9p9DTmbaC:OhXxekcjjjj94hXkaAaXcCtVhAkaHaABdbaHclfhHavcxfhvalaOcefgO9hmbxdkkaxhvaihOalhHindndnavIdbawNJbbbZMgC:lJbbb9p9DTmbaC:OhAxekcjjjj94hAkaAcCthAdndnavclfIdbawNJbbbZMgC:lJbbb9p9DTmbaC:OhXxekcjjjj94hXkaXcqtaAVhAdndnavcwfIdbawNJbbbZMgC:lJbbb9p9DTmbaC:OhXxekcjjjj94hXkaOaAaXVBdbavcxfhvaOclfhOaHcufgHmbkkcbhOdnadTmbaehvcbhHinaOaiavclfydbcdtfydbgAaiavcwfydbcdtfydbgX9haiavydbcdtfydbgraA9haraX9hGGfhOavcxfhvaHcifgHad6mbkkdnas:ZgCaL:taY:Ygwaz:Y:tg8ANak:ZgEaO:Zg3:tNaEaL:tawaP:Y:tg5Na3aC:tNMg8EJbbbb9BmbaCaE:ta5a8Aa3aL:tNNNa8E:vawMhwkdndnaOaQ0mbaOhkaYhPxekaOhsaYhzkdndnaKcl0mbdnawJbbbZMgw:lJbbb9p9DTmbaw:Ohvxdkcjjjj94hvxekaPazfcd9ThvkaKcefgKcs9hmbkkdndndnakmbJbbjZhwcbhOcdhvaDmexdkalcd4alfhHcehOinaOgvcethOavaH6mbkcbhOaqcuavcdtgYavcFFFFi0Ecbyd1:H:cjbHjjjjbbgKBdCaqciBd2aqamcbyd1:H:cjbHjjjjbbgzBdKaqclBd2dndndndnalTmbaPcuf:YhwaoTmecbhOaihAaxhHindndnaoaOfRbbceGTmbaOcjjjjlVhXxekdndnaHclfIdbawNJbbbZMgC:lJbbb9p9DTmbaC:OhXxekcjjjj94hXkaXcqthXdndnaHcwfIdbawNJbbbZMgC:lJbbb9p9DTmbaC:Ohrxekcjjjj94hrkaXarVhXdndnaHIdbawNJbbbZMgC:lJbbb9p9DTmbaC:Ohrxekcjjjj94hrkaXarcCtVhXkaAaXBdbaAclfhAaHcxfhHalaOcefgO9hmbxikkaKcFeaYz:tjjjb8AcbhPcbhvxdkaxhOaihHalhAindndnaOIdbawNJbbbZMgC:lJbbb9p9DTmbaC:OhXxekcjjjj94hXkaXcCthXdndnaOclfIdbawNJbbbZMgC:lJbbb9p9DTmbaC:Ohrxekcjjjj94hrkarcqtaXVhXdndnaOcwfIdbawNJbbbZMgC:lJbbb9p9DTmbaC:Ohrxekcjjjj94hrkaHaXarVBdbaOcxfhOaHclfhHaAcufgAmbkkaKcFeaYz:tjjjbhravcufhocbhPcbhYindndndnaraiaYcdtgKfydbgAcm4aA7c:v;t;h;Ev2gvcs4av7aoGgHcdtfgXydbgOcuSmbcehvinaiaOcdtgOfydbaASmdaHavfhOavcefhvaraOaoGgHcdtfgXydbgOcu9hmbkkaXaYBdbaPhvaPcefhPxekazaOfydbhvkazaKfavBdbaYcefgYal9hmbkcuaPc8S2gOaPc;D;O;f8U0EhvkcbhXaqavcbyd1:H:cjbHjjjjbbgvBd3aqcvBd2avcbaOz:tjjjbhOdnadTmbaehiinaxaiclfydbgrcx2fgvIdbaxaiydbgocx2fgHIdbg3:tgCaxaicwfydbgYcx2fgAIdlaHIdlg8A:tgwNavIdla8A:tgEaAIdba3:tg8EN:tgLaLNaEaAIdwaHIdwg5:tg8FNavIdwa5:tgEawN:tgwawNaEa8ENaCa8FN:tgCaCNMMg8E:rhEJbbnnJbbjZazaocdtfydbgvazarcdtfydbgASavazaYcdtfydbgrSGgHEh8Fdna8EJbbbb9ETmbaLaE:vhLaCaE:vhCawaE:vhwkaOavc8S2fgvavIdbawa8FaE:rNgEawNNg8FMUdbavaCaEaCNgaNghavIdlMUdlavaLaEaLNg8ENggavIdwMUdwavawaaNgaavIdxMUdxava8EawNg8JavIdzMUdzavaCa8ENg8EavIdCMUdCavawaEaLa5Nawa3Na8AaCNMM:mg8ANg3NgwavIdKMUdKavaCa3NgCavId3MUd3avaLa3NgLavIdaMUdaava3a8ANg3avId8KMUd8KavaEavIdyMUdydnaHmbaOaAc8S2fgva8FavIdbMUdbavahavIdlMUdlavagavIdwMUdwavaaavIdxMUdxava8JavIdzMUdzava8EavIdCMUdCavawavIdKMUdKavaCavId3MUd3avaLavIdaMUdaava3avId8KMUd8KavaEavIdyMUdyaOarc8S2fgva8FavIdbMUdbavahavIdlMUdlavagavIdwMUdwavaaavIdxMUdxava8JavIdzMUdzava8EavIdCMUdCavawavIdKMUdKavaCavId3MUd3avaLavIdaMUdaava3avId8KMUd8KavaEavIdyMUdykaicxfhiaXcifgXad6mbkkcbhAaqcuaPcdtgvaPcFFFFi0Egicbyd1:H:cjbHjjjjbbgHBdaaqcoBd2aqaicbyd1:H:cjbHjjjjbbgiBd8KaqcrBd2aHcFeavz:tjjjbhYdnalTmbazhHinJbbbbJbbjZaOaHydbgXc8S2fgvIdygw:vawJbbbb9BEavIdwaxcwfIdbgwNavIdzaxIdbgCNavIdaMgLaLMMawNavIdlaxclfIdbgLNavIdCawNavId3MgwawMMaLNavIdbaCNavIdxaLNavIdKMgwawMMaCNavId8KMMM:lNhwdndnaYaXcdtgvfgXydbcuSmbaiavfIdbaw9ETmekaXaABdbaiavfawUdbkaHclfhHaxcxfhxalaAcefgA9hmbkkdndnaPmbJbbbbhwxekJbbbbhwinaiIdbgCawawaC9DEhwaiclfhiaPcufgPmbkaw:rhwkakcd4akfhOcehiinaigvcethiavaO6mbkcbhOaqcuavcdtgiavcFFFFi0Ecbyd1:H:cjbHjjjjbbgHBdyaHcFeaiz:tjjjbhXdnadTmbavcufhrcbhPcbhxindnazaeaxcdtfgvydbcdtfydbgiazavclfydbcdtfydbgOSmbaiazavcwfydbcdtfydbgvSmbaOavSmbaYavcdtfydbhAdndnaYaOcdtfydbgvaYaicdtfydbgi9pmbavaA9pmbaAhlaihoavhAxekdnaAai9pmbaAav9pmbaihlavhoxekavhlaAhoaihAkabaPcx2fgvaABdbavcwfaoBdbavclfalBdbdnaXaoc:3F;N8N2alc:F:b:DD27aAc;D;O:B8J27arGgOcdtfgvydbgicuSmbcehHinaHhvdnabaicx2fgiydbaA9hmbaiydlal9hmbaiydwaoSmikavcefhHaXaOavfarGgOcdtfgvydbgicu9hmbkkavaPBdbaPcefhPkaxcifgxad6mbkaPci2hOkcwhvaDTmekaDawUdbkavcdthvaqcxfc98fhiinaiavfydbcbyd:m:H:cjbH:bjjjbbavc98fgvmbkaqc;Wbf8KjjjjbaOk:3ldrue9:8Jjjjjbc;Wb9Rgr8Kjjjjbcbhwarcxfcbc;Kbz:tjjjb8AdnabaeSmbabaeadcdtzMjjjb8AkarcualcdtalcFFFFi0EgDcbyd1:H:cjbHjjjjbbgqBdxarceBd2aqcbaialavcbarcxfz:djjjbcualcx2alc;v:Q;v:Qe0Ecbyd1:H:cjbHjjjjbbhkarcxfaryd2gxcdtfakBdbaraxcefgmBd2akaialavcbcbz:ejjjb8AarcxfamcdtfaDcbyd1:H:cjbHjjjjbbgiBdbaraxcdfgvBd2arcxfavcdtfcuaialaeadaqz:fjjjbgecltaecjjjjiGEcbyd1:H:cjbHjjjjbbgqBdbaqaeaiakalz:gjjjbaxcifhkdnadTmbaoaoNhocbhwabhlcbheindnaqaialydbgvcdtfydbcdtfIdbao9ETmbalclf8PdbhPabawcdtfgDavBdbaDclfaP83dbawcifhwkalcxfhlaecifgead6mbkkdnakTmbaxcdtarcxffcwfhlinalydbcbyd:m:H:cjbH:bjjjbbalc98fhlakcufgkmbkkarc;Wbf8Kjjjjbawk:WCoDud99vue99vuv998Jjjjjbc;Wb9Rgw8KjjjjbdndnarmbcbhDxekawcxfcbc;Kbz:tjjjb8Aawcuadcx2adc;v:Q;v:Qe0Ecbyd1:H:cjbHjjjjbbgqBdxawceBd2aqaeadaicbcbz:ejjjb8AawcuadcdtadcFFFFi0Egkcbyd1:H:cjbHjjjjbbgxBdzawcdBd2adcd4adfhmceheinaegicetheaiam6mbkcbhPawcuaicdtgsaicFFFFi0Ecbyd1:H:cjbHjjjjbbgzBdCawciBd2dndnar:ZgH:rJbbbZMgO:lJbbb9p9DTmbaO:Ohexekcjjjj94hekaicufhAc:bwhCcbhXadhQcbhLinaeaCcufgiaeai9iEaPcefaeaP9kEhDdndnadTmbaDcuf:YhOaqhiaxheadhmindndnaiIdbaONJbbbZMgK:lJbbb9p9DTmbaK:OhYxekcjjjj94hYkaYcCthYdndnaiclfIdbaONJbbbZMgK:lJbbb9p9DTmbaK:Oh8Axekcjjjj94h8Aka8AcqtaYVhYdndnaicwfIdbaONJbbbZMgK:lJbbb9p9DTmbaK:Oh8Axekcjjjj94h8AkaeaYa8AVBdbaicxfhiaeclfheamcufgmmbkazcFeasz:tjjjbhEcbh3cbh5indnaEaxa5cdtfydbgYcm4aY7c:v;t;h;Ev2gics4ai7aAGgmcdtfg8AydbgecuSmbaeaYSmbcehiinaEamaifaAGgmcdtfg8AydbgecuSmeaicefhiaeaY9hmbkka8AaYBdba3aecuSfh3a5cefg5ad9hmbxdkkazcFeasz:tjjjb8Acbh3kdnaQ:ZgKaH:taD:YgOaC:Y:tg8ENaX:Zg8Fa3:Zga:tNa8FaH:taOaP:Y:tghNaaaK:tNMggJbbbb9BmbaKa8F:taha8EaaaH:tNNNag:vaOMhOkaPaDa3ar0giEhPaXa3aiEhXdna3arSmbaDaCaiEgCaP9Rcd9imbdndnaLcl0mbdnaOJbbbZMgO:lJbbb9p9DTmbaO:Ohexdkcjjjj94hexekaPaCfcd9Theka3aQaiEhQaLcefgLcs9hmekkdndnaXmbcihicbhDxekcbhiawakcbyd1:H:cjbHjjjjbbg5BdKawclBd2aPcuf:YhKdndnadTmbaqhiaxheadhmindndnaiIdbaKNJbbbZMgO:lJbbb9p9DTmbaO:OhYxekcjjjj94hYkaYcCthYdndnaiclfIdbaKNJbbbZMgO:lJbbb9p9DTmbaO:Oh8Axekcjjjj94h8Aka8AcqtaYVhYdndnaicwfIdbaKNJbbbZMgO:lJbbb9p9DTmbaO:Oh8Axekcjjjj94h8AkaeaYa8AVBdbaicxfhiaeclfheamcufgmmbkazcFeasz:tjjjbhEcbhDcbh3indndndnaEaxa3cdtgCfydbgYcm4aY7c:v;t;h;Ev2gics4ai7aAGgmcdtfg8AydbgecuSmbcehiinaxaecdtgefydbaYSmdamaifheaicefhiaEaeaAGgmcdtfg8Aydbgecu9hmbkka8Aa3BdbaDhiaDcefhDxeka5aefydbhika5aCfaiBdba3cefg3ad9hmbkcuaDc32giaDc;j:KM;jb0EhexekazcFeasz:tjjjb8AcbhDcbhekawaecbyd1:H:cjbHjjjjbbgeBd3awcvBd2aecbaiz:tjjjbh8Aavcd4hxdnadTmbdnalTmbaxcdthEa5hYaqhealhmadhAina8AaYydbc32fgiaeIdbaiIdbMUdbaiaeclfIdbaiIdlMUdlaiaecwfIdbaiIdwMUdwaiamIdbaiIdxMUdxaiamclfIdbaiIdzMUdzaiamcwfIdbaiIdCMUdCaiaiIdKJbbjZMUdKaYclfhYaecxfheamaEfhmaAcufgAmbxdkka5hmaqheadhYina8Aamydbc32fgiaeIdbaiIdbMUdbaiaeclfIdbaiIdlMUdlaiaecwfIdbaiIdwMUdwaiaiIdxJbbbbMUdxaiaiIdzJbbbbMUdzaiaiIdCJbbbbMUdCaiaiIdKJbbjZMUdKamclfhmaecxfheaYcufgYmbkkdnaDTmba8AhiaDheinaiaiIdbJbbbbJbbjZaicKfIdbgO:vaOJbbbb9BEgONUdbaiclfgmaOamIdbNUdbaicwfgmaOamIdbNUdbaicxfgmaOamIdbNUdbaiczfgmaOamIdbNUdbaicCfgmaOamIdbNUdbaic3fhiaecufgembkkcbhYawcuaDcdtgCaDcFFFFi0Egicbyd1:H:cjbHjjjjbbgeBdaawcoBd2awaicbyd1:H:cjbHjjjjbbgEBd8KaecFeaCz:tjjjbh3dnadTmbaoJbbjZJbbjZaK:vaPceSENgOaONhKaxcdthxalheinaKaec;8:G:cjbalEgmIdwa8Aa5ydbgAc32fgiIdC:tgOaONamIdbaiIdx:tgOaONamIdlaiIdz:tgOaONMMNaqcwfIdbaiIdw:tgOaONaqIdbaiIdb:tgOaONaqclfIdbaiIdl:tgOaONMMMhOdndna3aAcdtgifgmydbcuSmbaEaifIdbaO9ETmekamaYBdbaEaifaOUdbka5clfh5aqcxfhqaeaxfheadaYcefgY9hmbkkaba3aCzMjjjb8Acrhikaicdthiawcxfc98fheinaeaifydbcbyd:m:H:cjbH:bjjjbbaic98fgimbkkawc;Wbf8KjjjjbaDk:Pdidui99ducbhi8Jjjjjbca9Rglcbyd1:G:cjbBdKalcb8Pdj:G:cjb83izalcbydN:G:cjbBdwalcb8Pd:m:G:cjb83ibdndnaembJbbjFhvJbbjFhoJbbjFhrxekadcd4cdthwincbhdinalczfadfgDabadfIdbgvaDIdbgoaoav9EEUdbaladfgDavaDIdbgoaoav9DEUdbadclfgdcx9hmbkabawfhbaicefgiae9hmbkalIdwalIdK:thralIdlalIdC:thoalIdbalIdz:thvkJbbbbavavJbbbb9DEgvaoaoav9DEgvararav9DEk9DeeuabcFeaicdtz:tjjjbhlcbhbdnadTmbindnalaeydbcdtfgiydbcu9hmbaiabBdbabcefhbkaeclfheadcufgdmbkkabk;Bidqui998Jjjjjbc;Wb9Rgl8Kjjjjbalcxfcbc;Kbz:tjjjb8Aadcd4adfhvcehoinaogrcethoarav6mbkalcuarcdtgoarcFFFFi0Ecbyd1:H:cjbHjjjjbbgvBdxavcFeaoz:tjjjbhwdnadTmbaicd4hDarcufhqcbhkindndnawcbaeakaD2cdtfgrydlgiaicjjjj94SEgocH4ao7c:F:b:DD2cbarydbgxaxcjjjj94SEgocH4ao7c;D;O:B8J27cbarydwgmamcjjjj94SEgrcH4ar7c:3F;N8N27aqGgvcdtfgrydbgocuSmbam::hPai::hsax::hzcehiinaihrdnaeaoaD2cdtfgiIdbaz9CmbaiIdlas9CmbaiIdwaP9BmikarcefhiawavarfaqGgvcdtfgrydbgocu9hmbkkarakBdbakhokabakcdtfaoBdbakcefgkad9hmbkkalydxcbyd:m:H:cjbH:bjjjbbalc;Wbf8Kjjjjbk9teiucbcbyd:q:H:cjbgeabcifc98GfgbBd:q:H:cjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaeczfheaiczfhiadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabk9teiucbcbyd:q:H:cjbgeabcrfc94GfgbBd:q:H:cjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikTeeucbabcbyd:q:H:cjbge9Rcifc98GaefgbBd:q:H:cjbdnabZbcztge9nmbabae9RcFFifcz4nb8Akkk:Kedbcj:Gdk1eFFuuFFuuFFuuFFuFFFuFFFuFbbbbbbbbebbbdbbbbbbbebbbebbbdbbbbbbbbbbbeeeeebebbebbebebbbeebbbbbbbbbbbbeeeeeebebbeeebeebbbbebebbbbbbbbbbbbbbbbbbc1:Hdkxebbbdbbb:G:qbb";
  var wasmpack = new Uint8Array([
    32,
    0,
    65,
    2,
    1,
    106,
    34,
    33,
    3,
    128,
    11,
    4,
    13,
    64,
    6,
    253,
    10,
    7,
    15,
    116,
    127,
    5,
    8,
    12,
    40,
    16,
    19,
    54,
    20,
    9,
    27,
    255,
    113,
    17,
    42,
    67,
    24,
    23,
    146,
    148,
    18,
    14,
    22,
    45,
    70,
    69,
    56,
    114,
    101,
    21,
    25,
    63,
    75,
    136,
    108,
    28,
    118,
    29,
    73,
    115
  ]);
  if (typeof WebAssembly !== "object") {
    return {
      supported: false
    };
  }
  var instance;
  var ready = WebAssembly.instantiate(unpack(wasm), {}).then(function(result) {
    instance = result.instance;
    instance.exports.__wasm_call_ctors();
  });
  function unpack(data) {
    var result = new Uint8Array(data.length);
    for (var i = 0; i < data.length; ++i) {
      var ch = data.charCodeAt(i);
      result[i] = ch > 96 ? ch - 97 : ch > 64 ? ch - 39 : ch + 4;
    }
    var write = 0;
    for (var i = 0; i < data.length; ++i) {
      result[write++] = result[i] < 60 ? wasmpack[result[i]] : (result[i] - 60) * 64 + result[++i];
    }
    return result.buffer.slice(0, write);
  }
  function assert(cond) {
    if (!cond) {
      throw new Error("Assertion failed");
    }
  }
  function bytes(view) {
    return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
  }
  function genremap(fun, positions, vertices, stride) {
    var sbrk = instance.exports.sbrk;
    var rp = sbrk(vertices * 4);
    var sp = sbrk(vertices * stride * 4);
    var heap = new Uint8Array(instance.exports.memory.buffer);
    heap.set(bytes(positions), sp);
    fun(rp, sp, vertices, stride * 4);
    heap = new Uint8Array(instance.exports.memory.buffer);
    var remap = new Uint32Array(vertices);
    new Uint8Array(remap.buffer).set(heap.subarray(rp, rp + vertices * 4));
    sbrk(rp - sbrk(0));
    return remap;
  }
  function reorder(fun, indices, vertices) {
    var sbrk = instance.exports.sbrk;
    var ip = sbrk(indices.length * 4);
    var rp = sbrk(vertices * 4);
    var heap = new Uint8Array(instance.exports.memory.buffer);
    var indices8 = bytes(indices);
    heap.set(indices8, ip);
    var unique = fun(rp, ip, indices.length, vertices);
    heap = new Uint8Array(instance.exports.memory.buffer);
    var remap = new Uint32Array(vertices);
    new Uint8Array(remap.buffer).set(heap.subarray(rp, rp + vertices * 4));
    sbrk(ip - sbrk(0));
    for (var i = 0; i < indices.length; ++i) indices[i] = remap[indices[i]];
    return [remap, unique];
  }
  function maxindex(source) {
    var result = 0;
    for (var i = 0; i < source.length; ++i) {
      var index = source[i];
      result = result < index ? index : result;
    }
    return result;
  }
  function simplify(fun, indices, index_count, vertex_positions, vertex_count, vertex_positions_stride, target_index_count, target_error, options) {
    var sbrk = instance.exports.sbrk;
    var te = sbrk(4);
    var ti = sbrk(index_count * 4);
    var sp = sbrk(vertex_count * vertex_positions_stride);
    var si = sbrk(index_count * 4);
    var heap = new Uint8Array(instance.exports.memory.buffer);
    heap.set(bytes(vertex_positions), sp);
    heap.set(bytes(indices), si);
    var result = fun(ti, si, index_count, sp, vertex_count, vertex_positions_stride, target_index_count, target_error, options, te);
    heap = new Uint8Array(instance.exports.memory.buffer);
    var target = new Uint32Array(result);
    bytes(target).set(heap.subarray(ti, ti + result * 4));
    var error = new Float32Array(1);
    bytes(error).set(heap.subarray(te, te + 4));
    sbrk(te - sbrk(0));
    return [target, error[0]];
  }
  function simplifyAttr(fun, indices, index_count, vertex_positions, vertex_count, vertex_positions_stride, vertex_attributes, vertex_attributes_stride, attribute_weights, vertex_lock, target_index_count, target_error, options) {
    var sbrk = instance.exports.sbrk;
    var te = sbrk(4);
    var ti = sbrk(index_count * 4);
    var sp = sbrk(vertex_count * vertex_positions_stride);
    var sa = sbrk(vertex_count * vertex_attributes_stride);
    var sw = sbrk(attribute_weights.length * 4);
    var si = sbrk(index_count * 4);
    var vl = vertex_lock ? sbrk(vertex_count) : 0;
    var heap = new Uint8Array(instance.exports.memory.buffer);
    heap.set(bytes(vertex_positions), sp);
    heap.set(bytes(vertex_attributes), sa);
    heap.set(bytes(attribute_weights), sw);
    heap.set(bytes(indices), si);
    if (vertex_lock) {
      heap.set(bytes(vertex_lock), vl);
    }
    var result = fun(
      ti,
      si,
      index_count,
      sp,
      vertex_count,
      vertex_positions_stride,
      sa,
      vertex_attributes_stride,
      sw,
      attribute_weights.length,
      vl,
      target_index_count,
      target_error,
      options,
      te
    );
    heap = new Uint8Array(instance.exports.memory.buffer);
    var target = new Uint32Array(result);
    bytes(target).set(heap.subarray(ti, ti + result * 4));
    var error = new Float32Array(1);
    bytes(error).set(heap.subarray(te, te + 4));
    sbrk(te - sbrk(0));
    return [target, error[0]];
  }
  function simplifyUpdate(fun, indices, index_count, vertex_positions, vertex_count, vertex_positions_stride, vertex_attributes, vertex_attributes_stride, attribute_weights, vertex_lock, target_index_count, target_error, options) {
    var sbrk = instance.exports.sbrk;
    var te = sbrk(4);
    var sp = sbrk(vertex_count * vertex_positions_stride);
    var sa = sbrk(vertex_count * vertex_attributes_stride);
    var sw = sbrk(attribute_weights.length * 4);
    var si = sbrk(index_count * 4);
    var vl = vertex_lock ? sbrk(vertex_count) : 0;
    var heap = new Uint8Array(instance.exports.memory.buffer);
    heap.set(bytes(vertex_positions), sp);
    heap.set(bytes(vertex_attributes), sa);
    heap.set(bytes(attribute_weights), sw);
    heap.set(bytes(indices), si);
    if (vertex_lock) {
      heap.set(bytes(vertex_lock), vl);
    }
    var result = fun(
      si,
      index_count,
      sp,
      vertex_count,
      vertex_positions_stride,
      sa,
      vertex_attributes_stride,
      sw,
      attribute_weights.length,
      vl,
      target_index_count,
      target_error,
      options,
      te
    );
    heap = new Uint8Array(instance.exports.memory.buffer);
    bytes(indices).set(heap.subarray(si, si + result * 4));
    bytes(vertex_positions).set(heap.subarray(sp, sp + vertex_count * vertex_positions_stride));
    bytes(vertex_attributes).set(heap.subarray(sa, sa + vertex_count * vertex_attributes_stride));
    var error = new Float32Array(1);
    bytes(error).set(heap.subarray(te, te + 4));
    sbrk(te - sbrk(0));
    return [result, error[0]];
  }
  function simplifyScale(fun, vertex_positions, vertex_count, vertex_positions_stride) {
    var sbrk = instance.exports.sbrk;
    var sp = sbrk(vertex_count * vertex_positions_stride);
    var heap = new Uint8Array(instance.exports.memory.buffer);
    heap.set(bytes(vertex_positions), sp);
    var result = fun(sp, vertex_count, vertex_positions_stride);
    sbrk(sp - sbrk(0));
    return result;
  }
  function simplifyPoints(fun, vertex_positions, vertex_count, vertex_positions_stride, vertex_colors, vertex_colors_stride, color_weight, target_vertex_count) {
    var sbrk = instance.exports.sbrk;
    var ti = sbrk(target_vertex_count * 4);
    var sp = sbrk(vertex_count * vertex_positions_stride);
    var sc = vertex_colors ? sbrk(vertex_count * vertex_colors_stride) : 0;
    var heap = new Uint8Array(instance.exports.memory.buffer);
    heap.set(bytes(vertex_positions), sp);
    if (vertex_colors) {
      heap.set(bytes(vertex_colors), sc);
    }
    var result = fun(ti, sp, vertex_count, vertex_positions_stride, sc, vertex_colors_stride, color_weight, target_vertex_count);
    heap = new Uint8Array(instance.exports.memory.buffer);
    var target = new Uint32Array(result);
    bytes(target).set(heap.subarray(ti, ti + result * 4));
    sbrk(ti - sbrk(0));
    return target;
  }
  function simplifySloppy(fun, indices, index_count, vertex_positions, vertex_count, vertex_positions_stride, vertex_lock, target_index_count, target_error) {
    var sbrk = instance.exports.sbrk;
    var te = sbrk(4);
    var ti = sbrk(index_count * 4);
    var sp = sbrk(vertex_count * vertex_positions_stride);
    var si = sbrk(index_count * 4);
    var vl = vertex_lock ? sbrk(vertex_count) : 0;
    var heap = new Uint8Array(instance.exports.memory.buffer);
    heap.set(bytes(vertex_positions), sp);
    heap.set(bytes(indices), si);
    if (vertex_lock) {
      heap.set(bytes(vertex_lock), vl);
    }
    var result = fun(ti, si, index_count, sp, vertex_count, vertex_positions_stride, vl, target_index_count, target_error, te);
    heap = new Uint8Array(instance.exports.memory.buffer);
    var target = new Uint32Array(result);
    bytes(target).set(heap.subarray(ti, ti + result * 4));
    var error = new Float32Array(1);
    bytes(error).set(heap.subarray(te, te + 4));
    sbrk(te - sbrk(0));
    return [target, error[0]];
  }
  function simplifyPrune(fun, indices, index_count, vertex_positions, vertex_count, vertex_positions_stride, target_error) {
    var sbrk = instance.exports.sbrk;
    var ti = sbrk(index_count * 4);
    var sp = sbrk(vertex_count * vertex_positions_stride);
    var si = sbrk(index_count * 4);
    var heap = new Uint8Array(instance.exports.memory.buffer);
    heap.set(bytes(vertex_positions), sp);
    heap.set(bytes(indices), si);
    var result = fun(ti, si, index_count, sp, vertex_count, vertex_positions_stride, target_error);
    heap = new Uint8Array(instance.exports.memory.buffer);
    var target = new Uint32Array(result);
    bytes(target).set(heap.subarray(ti, ti + result * 4));
    sbrk(ti - sbrk(0));
    return target;
  }
  var simplifyOptions = {
    LockBorder: 1,
    Sparse: 2,
    ErrorAbsolute: 4,
    Prune: 8,
    Regularize: 16,
    Permissive: 32,
    _InternalDebug: 1 << 30
    // internal, don't use!
  };
  return {
    ready,
    supported: true,
    compactMesh: function(indices) {
      assert(
        indices instanceof Uint32Array || indices instanceof Int32Array || indices instanceof Uint16Array || indices instanceof Int16Array
      );
      assert(indices.length % 3 == 0);
      var indices32 = indices.BYTES_PER_ELEMENT == 4 ? indices : new Uint32Array(indices);
      var result = reorder(instance.exports.meshopt_optimizeVertexFetchRemap, indices32, maxindex(indices) + 1);
      if (indices !== indices32) {
        for (var i = 0; i < indices32.length; ++i) {
          indices[i] = indices32[i];
        }
      }
      return result;
    },
    generatePositionRemap: function(vertex_positions, vertex_positions_stride) {
      assert(vertex_positions instanceof Float32Array);
      assert(vertex_positions.length % vertex_positions_stride == 0);
      assert(vertex_positions_stride >= 3);
      return genremap(
        instance.exports.meshopt_generatePositionRemap,
        vertex_positions,
        vertex_positions.length / vertex_positions_stride,
        vertex_positions_stride
      );
    },
    simplify: function(indices, vertex_positions, vertex_positions_stride, target_index_count, target_error, flags) {
      assert(
        indices instanceof Uint32Array || indices instanceof Int32Array || indices instanceof Uint16Array || indices instanceof Int16Array
      );
      assert(indices.length % 3 == 0);
      assert(vertex_positions instanceof Float32Array);
      assert(vertex_positions.length % vertex_positions_stride == 0);
      assert(vertex_positions_stride >= 3);
      assert(target_index_count >= 0 && target_index_count <= indices.length);
      assert(target_index_count % 3 == 0);
      assert(target_error >= 0);
      var options = 0;
      for (var i = 0; i < (flags ? flags.length : 0); ++i) {
        assert(flags[i] in simplifyOptions);
        options |= simplifyOptions[flags[i]];
      }
      var indices32 = indices.BYTES_PER_ELEMENT == 4 ? indices : new Uint32Array(indices);
      var result = simplify(
        instance.exports.meshopt_simplify,
        indices32,
        indices.length,
        vertex_positions,
        vertex_positions.length / vertex_positions_stride,
        vertex_positions_stride * 4,
        target_index_count,
        target_error,
        options
      );
      result[0] = indices instanceof Uint32Array ? result[0] : new indices.constructor(result[0]);
      return result;
    },
    simplifyWithAttributes: function(indices, vertex_positions, vertex_positions_stride, vertex_attributes, vertex_attributes_stride, attribute_weights, vertex_lock, target_index_count, target_error, flags) {
      assert(
        indices instanceof Uint32Array || indices instanceof Int32Array || indices instanceof Uint16Array || indices instanceof Int16Array
      );
      assert(indices.length % 3 == 0);
      assert(vertex_positions instanceof Float32Array);
      assert(vertex_positions.length % vertex_positions_stride == 0);
      assert(vertex_positions_stride >= 3);
      assert(vertex_attributes instanceof Float32Array);
      assert(vertex_attributes.length == vertex_attributes_stride * (vertex_positions.length / vertex_positions_stride));
      assert(vertex_attributes_stride >= 0);
      assert(vertex_lock == null || vertex_lock instanceof Uint8Array);
      assert(vertex_lock == null || vertex_lock.length == vertex_positions.length / vertex_positions_stride);
      assert(target_index_count >= 0 && target_index_count <= indices.length);
      assert(target_index_count % 3 == 0);
      assert(target_error >= 0);
      assert(Array.isArray(attribute_weights));
      assert(vertex_attributes_stride >= attribute_weights.length);
      assert(attribute_weights.length <= 32);
      for (var i = 0; i < attribute_weights.length; ++i) {
        assert(attribute_weights[i] >= 0);
      }
      var options = 0;
      for (var i = 0; i < (flags ? flags.length : 0); ++i) {
        assert(flags[i] in simplifyOptions);
        options |= simplifyOptions[flags[i]];
      }
      var indices32 = indices.BYTES_PER_ELEMENT == 4 ? indices : new Uint32Array(indices);
      var result = simplifyAttr(
        instance.exports.meshopt_simplifyWithAttributes,
        indices32,
        indices.length,
        vertex_positions,
        vertex_positions.length / vertex_positions_stride,
        vertex_positions_stride * 4,
        vertex_attributes,
        vertex_attributes_stride * 4,
        new Float32Array(attribute_weights),
        vertex_lock,
        target_index_count,
        target_error,
        options
      );
      result[0] = indices instanceof Uint32Array ? result[0] : new indices.constructor(result[0]);
      return result;
    },
    simplifyWithUpdate: function(indices, vertex_positions, vertex_positions_stride, vertex_attributes, vertex_attributes_stride, attribute_weights, vertex_lock, target_index_count, target_error, flags) {
      assert(
        indices instanceof Uint32Array || indices instanceof Int32Array || indices instanceof Uint16Array || indices instanceof Int16Array
      );
      assert(indices.length % 3 == 0);
      assert(vertex_positions instanceof Float32Array);
      assert(vertex_positions.length % vertex_positions_stride == 0);
      assert(vertex_positions_stride >= 3);
      assert(vertex_attributes instanceof Float32Array);
      assert(vertex_attributes.length == vertex_attributes_stride * (vertex_positions.length / vertex_positions_stride));
      assert(vertex_attributes_stride >= 0);
      assert(vertex_lock == null || vertex_lock instanceof Uint8Array);
      assert(vertex_lock == null || vertex_lock.length == vertex_positions.length / vertex_positions_stride);
      assert(target_index_count >= 0 && target_index_count <= indices.length);
      assert(target_index_count % 3 == 0);
      assert(target_error >= 0);
      assert(Array.isArray(attribute_weights));
      assert(vertex_attributes_stride >= attribute_weights.length);
      assert(attribute_weights.length <= 32);
      for (var i = 0; i < attribute_weights.length; ++i) {
        assert(attribute_weights[i] >= 0);
      }
      var options = 0;
      for (var i = 0; i < (flags ? flags.length : 0); ++i) {
        assert(flags[i] in simplifyOptions);
        options |= simplifyOptions[flags[i]];
      }
      var indices32 = indices.BYTES_PER_ELEMENT == 4 ? indices : new Uint32Array(indices);
      var result = simplifyUpdate(
        instance.exports.meshopt_simplifyWithUpdate,
        indices32,
        indices.length,
        vertex_positions,
        vertex_positions.length / vertex_positions_stride,
        vertex_positions_stride * 4,
        vertex_attributes,
        vertex_attributes_stride * 4,
        new Float32Array(attribute_weights),
        vertex_lock,
        target_index_count,
        target_error,
        options
      );
      if (indices !== indices32) {
        for (var i = 0; i < result[0]; ++i) {
          indices[i] = indices32[i];
        }
      }
      return result;
    },
    getScale: function(vertex_positions, vertex_positions_stride) {
      assert(vertex_positions instanceof Float32Array);
      assert(vertex_positions.length % vertex_positions_stride == 0);
      assert(vertex_positions_stride >= 3);
      return simplifyScale(
        instance.exports.meshopt_simplifyScale,
        vertex_positions,
        vertex_positions.length / vertex_positions_stride,
        vertex_positions_stride * 4
      );
    },
    simplifyPoints: function(vertex_positions, vertex_positions_stride, target_vertex_count, vertex_colors, vertex_colors_stride, color_weight) {
      assert(vertex_positions instanceof Float32Array);
      assert(vertex_positions.length % vertex_positions_stride == 0);
      assert(vertex_positions_stride >= 3);
      assert(target_vertex_count >= 0 && target_vertex_count <= vertex_positions.length / vertex_positions_stride);
      if (vertex_colors) {
        assert(vertex_colors instanceof Float32Array);
        assert(vertex_colors.length % vertex_colors_stride == 0);
        assert(vertex_colors_stride >= 3);
        assert(vertex_positions.length / vertex_positions_stride == vertex_colors.length / vertex_colors_stride);
        return simplifyPoints(
          instance.exports.meshopt_simplifyPoints,
          vertex_positions,
          vertex_positions.length / vertex_positions_stride,
          vertex_positions_stride * 4,
          vertex_colors,
          vertex_colors_stride * 4,
          color_weight || 0,
          target_vertex_count
        );
      } else {
        return simplifyPoints(
          instance.exports.meshopt_simplifyPoints,
          vertex_positions,
          vertex_positions.length / vertex_positions_stride,
          vertex_positions_stride * 4,
          void 0,
          0,
          0,
          target_vertex_count
        );
      }
    },
    simplifySloppy: function(indices, vertex_positions, vertex_positions_stride, vertex_lock, target_index_count, target_error) {
      assert(
        indices instanceof Uint32Array || indices instanceof Int32Array || indices instanceof Uint16Array || indices instanceof Int16Array
      );
      assert(indices.length % 3 == 0);
      assert(vertex_positions instanceof Float32Array);
      assert(vertex_positions.length % vertex_positions_stride == 0);
      assert(vertex_positions_stride >= 3);
      assert(vertex_lock == null || vertex_lock instanceof Uint8Array);
      assert(vertex_lock == null || vertex_lock.length == vertex_positions.length / vertex_positions_stride);
      assert(target_index_count >= 0 && target_index_count <= indices.length);
      assert(target_index_count % 3 == 0);
      assert(target_error >= 0);
      var indices32 = indices.BYTES_PER_ELEMENT == 4 ? indices : new Uint32Array(indices);
      var result = simplifySloppy(
        instance.exports.meshopt_simplifySloppy,
        indices32,
        indices.length,
        vertex_positions,
        vertex_positions.length / vertex_positions_stride,
        vertex_positions_stride * 4,
        vertex_lock,
        target_index_count,
        target_error
      );
      result[0] = indices instanceof Uint32Array ? result[0] : new indices.constructor(result[0]);
      return result;
    },
    simplifyPrune: function(indices, vertex_positions, vertex_positions_stride, target_error) {
      assert(
        indices instanceof Uint32Array || indices instanceof Int32Array || indices instanceof Uint16Array || indices instanceof Int16Array
      );
      assert(indices.length % 3 == 0);
      assert(vertex_positions instanceof Float32Array);
      assert(vertex_positions.length % vertex_positions_stride == 0);
      assert(vertex_positions_stride >= 3);
      assert(target_error >= 0);
      var indices32 = indices.BYTES_PER_ELEMENT == 4 ? indices : new Uint32Array(indices);
      var result = simplifyPrune(
        instance.exports.meshopt_simplifyPrune,
        indices32,
        indices.length,
        vertex_positions,
        vertex_positions.length / vertex_positions_stride,
        vertex_positions_stride * 4,
        target_error
      );
      result = indices instanceof Uint32Array ? result : new indices.constructor(result);
      return result;
    }
  };
})();

// node_modules/meshoptimizer/meshopt_clusterizer.js
var MeshoptClusterizer = (function() {
  var wasm = "b9H79Tebbbe:neP9Geueu9Geub9Gbb9Giuuueu9Gmuuuuuuuuuuu9999eu9Gouuuuuueu9Gruuuuuuub9Gxuuuuuuuuuuuueu9Gxuuuuuuuuuuu99eu9GPuuuuuuuuuuuuu99b9Gouuuuuub9Gwuuuuuuuub9Gvuuuuub9GluuuubiQXdilvorwDqokoqxmbiibeilve9Weiiviebeoweuecj:Gdkr;Zeqo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9I919P29K9nW79O2Wt79c9V919U9KbeY9TW79O9V9Wt9F9I919P29K9nW79O2Wt7S2W94bd39TW79O9V9Wt9F9I919P29K9nW79O2Wt79t9W9Ht9P9H2bo39TW79O9V9Wt9F9J9V9T9W91tWJ2917tWV9c9V919U9K7bw39TW79O9V9Wt9F9J9V9T9W91tW9nW79O2Wt9c9V919U9K7bkE9TW79O9V9Wt9F9J9V9T9W91tW9t9W9OWVW9c9V919U9K7bxL9TW79O9V9Wt9F9V9Wt9P9T9P96W9nW79O2WtbPl79IV9RbsDwebcekdOAq;W:leXdbkIbabaec9:fgefcufae9Ugeabci9Uadfcufad9Ugbaeab0Ek:88JDPue99eux99due99euo99iu8Jjjjjbc:WD9Rgm8KjjjjbdndnalmbcbhPxekamc:Cwfcbc;Kbz:rjjjb8AcuaocdtgsaocFFFFi0Ehzcbyd;0:G:cjbhHdndnalcb9imbaoal9nmbamazaHHjjjjbbgHBd:CwamceBd;8wamazcbyd;0:G:cjbHjjjjbbgOBd:GwamcdBd;8wamcualcdtalcFFFFi0Ecbyd;0:G:cjbHjjjjbbgABd:KwamciBd;8waihzalhsinaHazydbcdtfcbBdbazclfhzascufgsmbkaihzalhsinaHazydbcdtfgCaCydbcefBdbazclfhzascufgsmbkaihzalhCcbhXindnaHazydbcdtgQfgsydbcb9imbaOaQfaXBdbasasydbgQcjjjj94VBdbaQaXfhXkazclfhzaCcufgCmbkalci9UhLdnalci6mbcbhzaihsinascwfydbhCasclfydbhXaOasydbcdtfgQaQydbgQcefBdbaAaQcdtfazBdbaOaXcdtfgXaXydbgXcefBdbaAaXcdtfazBdbaOaCcdtfgCaCydbgCcefBdbaAaCcdtfazBdbascxfhsaLazcefgz9hmbkkaihzalhsindnaHazydbcdtgCfgXydbgQcu9kmbaXaQcFFFFrGgQBdbaOaCfgCaCydbaQ9RBdbkazclfhzascufgsmbxdkkamazaHHjjjjbbgHBd:CwamceBd;8wamazcbyd;0:G:cjbHjjjjbbgOBd:GwamcdBd;8wamcualcdtalcFFFFi0Ecbyd;0:G:cjbHjjjjbbgABd:KwamciBd;8waHcbasz:rjjjbhXaihzalhsinaXazydbcdtfgCaCydbcefBdbazclfhzascufgsmbkalci9UhLdnaoTmbcbhzaOhsaXhCaohQinasazBdbasclfhsaCydbazfhzaCclfhCaQcufgQmbkkdnalci6mbcbhzaihsinascwfydbhCasclfydbhQaOasydbcdtfgKaKydbgKcefBdbaAaKcdtfazBdbaOaQcdtfgQaQydbgQcefBdbaAaQcdtfazBdbaOaCcdtfgCaCydbgCcefBdbaAaCcdtfazBdbascxfhsaLazcefgz9hmbkkaoTmbcbhzaohsinaOazfgCaCydbaXazfydb9RBdbazclfhzascufgsmbkkamaLcbyd;0:G:cjbHjjjjbbgzBd:OwamclBd;8wazcbaLz:rjjjbhYamcuaLcK2alcjjjjd0Ecbyd;0:G:cjbHjjjjbbg8ABd:SwamcvBd;8wJbbbbhEdnalci6g3mbarcd4hKaihsa8AhzaLhrJbbbbh5inavasclfydbaK2cdtfgCIdlh8EavasydbaK2cdtfgXIdlhEavascwfydbaK2cdtfgQIdlh8FaCIdwhaaXIdwhhaQIdwhgazaCIdbg8JaXIdbg8KMaQIdbg8LMJbbnn:vUdbazclfaXIdlaCIdlMaQIdlMJbbnn:vUdbaQIdwh8MaCIdwh8NaXIdwhyazcxfa8EaE:tg8Eagah:tggNaaah:tgaa8FaE:tghN:tgEJbbbbJbbjZa8Ja8K:tg8FahNa8Ea8La8K:tg8KN:tghahNaEaENaaa8KNa8FagN:tgEaENMMg8K:rg8E:va8KJbbbb9BEg8KNUdbazczfaEa8KNUdbazcCfaha8KNUdbazcwfa8Maya8NMMJbbnn:vUdba5a8EMh5ascxfhsazcKfhzarcufgrmbka5aL:Z:vJbbbZNhEkamcuaLcdtalcFFFF970Ecbyd;0:G:cjbHjjjjbbgCBd:WwamcoBd;8waq:Zhhdna3mbcbhzaChsinasazBdbasclfhsaLazcefgz9hmbkkaEahNhhamcuaLcltalcFFFFd0Ecbyd;0:G:cjbHjjjjbbg8PBd:0wamcrBd;8wcba8Pa8AaCaLcbz:djjjb8AJFFuuh8MJFFuuh8NJFFuuhydnalci6mbJFFuuhya8AhzaLhsJFFuuh8NJFFuuh8MinazcwfIdbgEa8Ma8MaE9EEh8MazclfIdbgEa8Na8NaE9EEh8NazIdbgEayayaE9EEhyazcKfhzascufgsmbkkah:rhEamaocetgzcuaocu9kEcbyd;0:G:cjbHjjjjbbgCBd:4wdndnaoal9nmbaihzalhsinaCazydbcetfcFFi87ebazclfhzascufgsmbxdkkaCcFeazz:rjjjb8AkaEJbbbZNh8JcuhIdnalci6mbcbhsJFFuuhEa8AhzcuhIinazcwfIdba8M:tghahNazIdbay:tghahNazclfIdba8N:tghahNMM:rghaEaIcuSahaE9DVgXEhEasaIaXEhIazcKfhzaLascefgs9hmbkkamczfcbcjwz:rjjjb8Aam9cb83iwam9cb83ibaxa8JNh8RJbbjZak:th8Lcbh8SJbbbbhRJbbbbh8UJbbbbh8VJbbbbh8WJbbbbh8XJbbbbh8Ycbh8ZcbhPinJbbbbhEdna8STmbJbbjZa8S:Z:vhEkJbbbbhhdna8Ya8YNa8Wa8WNa8Xa8XNMMg8KJbbbb9BmbJbbjZa8K:r:vhhka8VaENh8Ka8UaENh5aRaENh8EaIhLdndndndndna8SaPVTmbamydwg80Tmea8YahNh8Fa8XahNhaa8WahNhgaeamydbcdtfh81cbh3JFFuuhEcvhQcuhLindnaHa81a3cdtfydbcdtgzfydbgvTmbaAaOazfydbcdtfhsindndnaCaiasydbgKcx2fgzclfydbgrcetf8Vebcs4aCazydbgXcetf8Vebcs4faCazcwfydbglcetf8Vebcs4fgombcbhzxekcehzaHaXcdtfydbgXceSmbcehzaHarcdtfydbgrceSmbcehzaHalcdtfydbglceSmbdnarcdSaXcdSfalcdSfcd6mbaocefhzxekaocdfhzkdnazaQ9kmba8AaKcK2fgXIdwa8K:tghahNaXIdba8E:tghahNaXIdla5:tghahNMM:ra8J:va8LNJbbjZMJ9VO:d86JbbjZaXIdCa8FNaXIdxagNaaaXIdzNMMakN:tghahJ9VO:d869DENghaEazaQ6ahaE9DVgXEhEaKaLaXEhLazaQaXEhQkasclfhsavcufgvmbkka3cefg3a809hmbkkaLcu9hmekama8KUd:ODama5Ud:KDama8EUd:GDamcuBd:qDamcFFF;7rBdjDa8Pcba8AaYamc:GDfamc:qDfamcjDfz:ejjjbamyd:qDhLdndnaxJbbbb9ETmba8SaD6mbaLcuSmeceh3amIdjDa8R9EmixdkaLcu9hmekdna8STmbabaPcltfgHam8Piw83dwaHam8Pib83dbaPcefhPkc3hHinamc:CwfaHfydbcbyd;4:G:cjbH:bjjjbbaHc98fgHc989hmbxvkkcbh3a8Saq9pmbamydwaCaiaLcx2fgzydbcetf8Vebcs4aCazcwfydbcetf8Vebcs4faCazclfydbcetf8Vebcs4ffaw9nmekcbhzcbhsdna8ZTmbcbhsamczfhXinamczfascdtfaXydbgQBdbaXclfhXasaYaQfRbbTfhsa8Zcufg8ZmbkkamydwhlamydbhXam9cu83i:GDam9cu83i:ODam9cu83i:qDam9cu83i:yDinamcjDfazfcFFF;7rBdbazclfgzcz9hmbkasc;8easclfc:bd6Eg8Zcdth80dnalTmbaeaXcdtfhocbhrindnaHaoarcdtfydbcdtgzfydbgvTmbaAaOazfydbcdtfhscuhQcuhzinaHaiasydbgKcx2fgXclfydbcdtfydbaHaXydbcdtfydbfaHaXcwfydbcdtfydbfgXazaXaz6gXEhzaKaQaXEhQasclfhsavcufgvmbkaQcuSmba8AaQcK2fgsIdwa8M:tgEaENasIdbay:tgEaENasIdla8N:tgEaENMM:rhEcbhsindndnazamc:qDfasfgvydbgX6mbazaX9hmeaEamcjDfasfIdb9FTmekavazBdbamc:GDfasfaQBdbamcjDfasfaEUdbxdkasclfgscz9hmbkkarcefgral9hmbkkamczfa80fhQcbhzcbhsindnamc:GDfazfydbgXcuSmbaQascdtfaXBdbascefhskazclfgzcz9hmbkasa8Zfg8ZTmbJFFuuhhcuhKamczfhza8ZhvcuhQina8AazydbgXcK2fgsIdwa8M:tgEaENasIdbay:tgEaENasIdla8N:tgEaENMM:rhEdndnaHaiaXcx2fgsclfydbcdtfydbaHasydbcdtfydbfaHascwfydbcdtfydbfgsaQ6mbasaQ9hmeaEah9DTmekaEhhashQaXhKkazclfhzavcufgvmbkaKcuSmbaKhLkdnamaiaLcx2fgrydbarclfydbarcwfydbaCabaeadaPawaqa3z:fjjjbTmbaPcefhPJbbbbhRJbbbbh8UJbbbbh8VJbbbbh8WJbbbbh8XJbbbbh8YkcbhXinaAaOaraXcdtfydbcdtgsfydbcdtfgKhzaHasfgvydbgQhsdnaQTmbdninazydbaLSmeazclfhzascufgsTmdxbkkazaKaQcdtfc98fydbBdbavavydbcufBdbkaXcefgXci9hmbka8AaLcK2fgzIdbhEazIdlhhazIdwh8KazIdxh5azIdzh8EazIdCh8FaYaLfce86bba8Ya8FMh8Ya8Xa8EMh8Xa8Wa5Mh8Wa8Va8KMh8Va8UahMh8UaRaEMhRamydxh8Sxbkkamc:WDf8KjjjjbaPkjoivuv99lu8Jjjjjbca9Rgo8Kjjjjbdndnalcw0mbaiydbhraeabcitfgwalcdtciVBdlawarBdbdnalcd6mbaiclfhralcufhDawcxfhwinarydbhqawcuBdbawc98faqBdbawcwfhwarclfhraDcufgDmbkkalabfhwxekcbhqaocbBdKao9cb83izaocbBdwao9cb83ibJbbjZhkJbbjZhxinadaiaqcdtfydbcK2fhDcbhwinaoczfawfgraDawfIdbgmarIdbgP:tgsaxNaPMgPUdbaoawfgrasamaP:tNarIdbMUdbawclfgwcx9hmbkJbbjZakJbbjZMgk:vhxaqcefgqal9hmbkcbhradcbcecdaoIdlgmaoIdwgP9GEgwaoIdbgsaP9GEawasam9GEgzcdtgwfhHaoczfawfIdbhmaihwalhDinaiarcdtfgqydbhOaqawydbgABdbawaOBdbawclfhwaraHaAcK2fIdbam9DfhraDcufgDmbkdndnarcv6mbavc8X9kmbaralc98f6mekaiydbhraeabcitfgwalcdtciVBdlawarBdbaiclfhralcufhDawcxfhwinarydbhqawcuBdbawc98faqBdbawcwfhwarclfhraDcufgDmbkalabfhwxekaeabcitfgwamUdbawawydlc98GazVBdlabcefaeadaiaravcefgqz:djjjbhDawawydlciGaDabcu7fcdtVBdlaDaeadaiarcdtfalar9Raqz:djjjbhwkaocaf8Kjjjjbawk;Oddvue99dninabaecitfgrydlgwcd4gDTmednawciGgqci9hmbcihqdnawcl6mbabaecitfhbcbheawhqcehkindnaiabydbgDfRbbmbcbhkadaDcK2fgwIdwalIdw:tgxaxNawIdbalIdb:tgxaxNawIdlalIdl:tgxaxNMM:rgxaoIdb9DTmbaoaxUdbavaDBdbarydlhqkabcwfhbaecefgeaqcd46mbkakceGTmikaraqciGBdlskdnabcbaDalaqcdtfIdbarIdb:tgxJbbbb9FEgwaD7aecefgDfgecitfydlabawaDfgDcitfydlVci0mbaraqBdlkabaDadaialavaoz:ejjjbax:laoIdb9Fmbkkkjlevudndnabydwgxaladcetfgm8Vebcs4alaecetfgP8Vebgscs4falaicetfgz8Vebcs4ffaD0mbakmbcbhDabydxaq6mekavawcltfgxab8Pdw83dwaxab8Pdb83dbabydbhDdnabydwgwTmbaoaDcdtfhxawhsinalaxydbcetfcFFi87ebaxclfhxascufgsmbkkabaDawfBdbabydxhxab9cb83dwababydlaxci2fBdlaP8VebhscehDcbhxkdnascztcz91cu9kmbabaxcefBdwaPax87ebaoabydbcdtfaxcdtfaeBdbkdnam8Uebcu9kmbababydwgxcefBdwamax87ebaoabydbcdtfaxcdtfadBdbkdnaz8Uebcu9kmbababydwgxcefBdwazax87ebaoabydbcdtfaxcdtfaiBdbkarabydlfabydxci2faPRbb86bbarabydlfabydxci2fcefamRbb86bbarabydlfabydxci2fcdfazRbb86bbababydxcefBdxaDk:mPrHue99eue99eue99iu8Jjjjjbc;W;Gb9Rgx8KjjjjbdndnalmbcbhmxekcbhPaxc:m;Gbfcbc;Kbz:rjjjb8Aaxcualci9UgscltascjjjjiGEcbyd;0:G:cjbHjjjjbbgzBd:m9GaxceBd;S9GaxcuascK2gHcKfalcpFFFe0Ecbyd;0:G:cjbHjjjjbbgOBd:q9GaxcdBd;S9Gdnalci6gAmbarcd4hCascdthXaOhQazhLinavaiaPcx2fgrydwaC2cdtfhKavarydlaC2cdtfhYavarydbaC2cdtfh8AcbhraLhEinaQarfgma8Aarfg3Idbg5aYarfg8EIdbg8Fa5a8F9DEg5UdbamaKarfgaIdbg8Fa5a8Fa59DEg8FUdbamcxfgma3Idbg5a8EIdbgha5ah9EEg5UdbamaaIdbgha5aha59EEg5UdbaEa8Fa5MJbbbZNUdbaEaXfhEarclfgrcx9hmbkaQcKfhQaLclfhLaPcefgPas9hmbkkaOaHfgr9cb83dbar9cb83dzar9cb83dwaxcuascx2gralc:bjjjl0Ecbyd;0:G:cjbHjjjjbbgHBdN9GaxciBd;S9GascdthgazarfhvaxcwVhPaxclVhCaHh8Jazh8KcbhLinaxcbcj;Gbz:rjjjbhEaLas2cdthadnaAmba8Khrash3inaEarydbgmc8F91cjjjj94Vam7gmcQ4cx2fg8Ea8EydwcefBdwaEamcd4cFrGcx2fg8Ea8EydbcefBdbaEamcx4cFrGcx2fgmamydlcefBdlarclfhra3cufg3mbkkazaafh8AaHaafhXcbhmcbh3cbh8EcbhainaEamfgrydbhQara3BdbarcwfgKydbhYaKaaBdbarclfgrydbhKara8EBdbaQa3fh3aYaafhaaKa8Efh8Eamcxfgmcj;Gb9hmbkdnaAmbcbhravhminamarBdbamclfhmasarcefgr9hmbkavhrashminaEa8Aarydbg3cdtfydbg8Ec8F91a8E7cd4cFrGcx2fg8Ea8Eydbg8EcefBdbaXa8Ecdtfa3Bdbarclfhramcufgmmbka8JhrashminaCa8Aarydbg3cdtfydbg8Ec8F91a8E7cx4cFrGcx2fg8Ea8Eydbg8EcefBdbava8Ecdtfa3BdbarclfhramcufgmmbkavhrashminaPa8Aarydbg3cdtfydbg8Ec8F91cjjjj94Va8E7cQ4cx2fg8Ea8Eydbg8EcefBdbaXa8Ecdtfa3Bdbarclfhramcufgmmbkka8Jagfh8Ja8Kagfh8KaLcefgLci9hmbkaEaocetgrcuaocu9kEcbyd;0:G:cjbHjjjjbbgKBd:y9GaEclBd;S9Gdndnaoal9nmbaihralhminaKarydbcetfcFFi87ebarclfhramcufgmmbxdkkaKcFearz:rjjjb8Akcbh8EaEascbyd;0:G:cjbHjjjjbbg8ABd:C9GaOaHaHascdtfaHascitfa8AascbazaKaiawaDaqakz:hjjjbdndnalci6mba8Ahrashmina8EarRbbfh8EarcefhramcufgmmbkaE9cb83iwaE9cb83ibalawc9:fgrfcufar9UgrasaDfcufaD9Ugmaram0EhYcbhmcbhra8Ehaincbh3dnarTmba8AarfRbbceSh3kamaEaiaHydbcx2fgQydbaQclfydbaQcwfydbaKabaeadamawaqa3a3ce7a8EaY9nVaaamfaY6VGz:fjjjbfhmaHclfhHaaa8AarfRbb9Rhaasarcefgr9hmbkaEydxTmeabamcltfgraE8Piw83dwaraE8Pib83dbamcefhmxekaE9cb83iwaE9cb83ibcbhmkczhrinaEc:m;Gbfarfydbcbyd;4:G:cjbH:bjjjbbarc98fgrc989hmbkkaxc;W;Gbf8Kjjjjbamk:wKDQue99iue99iul9:euw99iu8Jjjjjbc;qb9RgP8Kjjjjbaxhsaxhzdndnavax0gHmbdnavTmbcbhOaehzavhAinawaDazydbcx2fgCcwfydbcetfgX8VebhQawaCclfydbcetfgL8VebhKawaCydbcetfgC8VebhYaXce87ebaLce87ebaCce87ebaOaKcs4aYcs4faQcs4ffhOazclfhzaAcufgAmbkaehzavhAinawaDazydbcx2fgCcwfydbcetfcFFi87ebawaCclfydbcetfcFFi87ebawaCydbcetfcFFi87ebazclfhzaAcufgAmbkcehzaqhsaOaq0mekalce86bbalcefcbavcufz:rjjjb8AxekaPaiBdxaPadBdwaPaeBdlavakaqci9Ug8Aaka8Aak6EaHEgK9RhEaxaK9Rh3aKcufh5aKceth8EaKcdtgCc98fh8FavcitgOaC9Rarfc98fhaascufhhavcufhgaraOfh8JJbbjZas:Y:vh8KcbazceakaxSEg8Lcdtg8M9Rh8NJFFuuhycuh8PcbhIcbh8RinaPclfa8RcdtfydbhQaPcb8Pd:y:G:cjbg8S83i9iaPcb8Pd:q:G:cjbgR83inaPcb8Pd1:G:cjbg8U83iUaPcb8Pdj:G:cjbg8V83i8WaPa8S83iyaPaR83iaaPa8U83iKaPa8V83izaQavcdtgYfh8WcbhXinabaQaXcdtgLfydbcK2fhAcbhzinaPc8WfazfgCaAazfgOIdbg8XaCIdbg8Ya8Xa8Y9DEUdbaCczfgCaOcxfIdbg8XaCIdbg8Ya8Xa8Y9EEUdbazclfgzcx9hmbkaba8WaXcu7cdtfydbcK2fhAcbhzaPIdUh8ZaPId9ih80aPId80h81aPId9ehBaPId8Wh83aPIdnhUinaPczfazfgCaAazfgOIdbg8XaCIdbg8Ya8Xa8Y9DEUdbaCczfgCaOcxfIdbg8XaCIdbg8Ya8Xa8Y9EEUdbazclfgzcx9hmbkaraLfgzaBa81:tg8Xa80a8Z:tg8YNaUa83:tg8Za8XNa8Za8YNMMUdbazaYfaPId8KaPIdC:tg8XaPIdyaPIdK:tg8YNaPIdaaPIdz:tg8Za8XNa8Za8YNMMUdbaXcefgXav9hmbkcbh85dnaHmbcbhAaQhza8JhCavhXinawaDazydbcx2fgOcwfydbcetfgL8Vebh8WawaOclfydbcetfg858Vebh86awaOydbcetfgO8Vebh87aLce87eba85ce87ebaOce87ebaCaAa86cs4a87cs4fa8Wcs4ffgABdbazclfhzaCclfhCaXcufgXmbkavhCinawaDaQydbcx2fgzcwfydbcetfcFFi87ebawazclfydbcetfcFFi87ebawazydbcetfcFFi87ebaQclfhQaCcufgCmbka8Jh85kdndndndndndndndndndndnava8E6mba8Eax9nmeavavaK9UgzaK29Raza320mda5aE9pmqa85Th87ceh8WaEhQxwka5ag9pmDa8Eax9nmixokavaK6mea5aE9pmwcehQaEhXa85Tmixlka5ag6mlxrka5ag9pmokcbhQaghXa85mekJFFuuh8XcbhLa5hzindnazcefgCaK6mbaQavaC9RgOaK6GmbarazcdtfIdbg8YaC:YNaravaz9RcdtfaYfc94fIdbg8ZaO:YNMg80a8X9Embdndna8KaOahf:YNg81:lJbbb9p9DTmba81:OhAxekcjjjj94hAka8ZasaA2aO9R:YNh8Zdndna8Kazasf:YNg81:lJbbb9p9DTmba81:OhOxekcjjjj94hOkamasaO2aC9R:Ya8YNa8ZMNa80Mg8Ya8Xa8Ya8X9DgOEh8XaCaLaOEhLkaza8LfgzaX6mbxlkkJFFuuh8XcbhLaEhCaahAa8FhOaKhzindnazaK6mbaQaCaK6GmbaraOfIdbg8Yaz:YNaAIdbg8ZaC:YNMg80a8X9Embdndna8Ka85aOfydbgYahf:YNg81:lJbbb9p9DTmba81:Oh8Wxekcjjjj94h8Wkamasa8W2aY9R:Yg81a8YNa8Za81NMNa80Mg8Ya8Xa8Ya8X9DgYEh8XazaLaYEhLkaCa8L9RhCaAa8NfhAaOa8MfhOaza8LfgzcufaX6mbxikka85Th87cbh8WaghQkJFFuuh8XcbhLaEhCaahAa8FhOaKhzindnazazaK9UgXaK29RaXa320mbdna8WTmbaCaCaK9UgXaK29RaXa320mekaraOfIdbg8Yaz:YNaAIdbg8ZaC:YNMg80a8X9EmbazhXaChYdna87mba85aOfydbgXhYkdndna8KaYahf:YNg81:lJbbb9p9DTmba81:Oh86xekcjjjj94h86ka8Zasa862aY9R:YNh8Zdndna8KaXahf:YNg81:lJbbb9p9DTmba81:OhYxekcjjjj94hYkamasaY2aX9R:Ya8YNa8ZMNa80Mg8Ya8Xa8Ya8X9DgXEh8XazaLaXEhLkaCa8L9RhCaAa8NfhAaOa8MfhOaza8LfgzcufaQ6mbkkaLTmba8Xay9DTmba8XhyaLhIa8Rh8Pka8Rcefg8Rci9hmbkdndnaoc8X9kmba8Pcb9omeka8Acufh85cbhYindndndnavaY9RaxaYaxfav0Eg8WTmbcbhAaeaYcdtfgzhCa8WhXinawaDaCydbcx2fgOcwfydbcetfgQ8VebhbawaOclfydbcetfgL8VebhrawaOydbcetfgO8VebhKaQce87ebaLce87ebaOce87ebaAarcs4aKcs4fabcs4ffhAaCclfhCaXcufgXmbka8WhOinawaDazydbcx2fgCcwfydbcetfcFFi87ebawaCclfydbcetfcFFi87ebawaCydbcetfcFFi87ebazclfhzaOcufgOmbkaAaq0mekalaYfgzce86bbazcefcba8Wcufz:rjjjb8AxekalaYfgzce86bbazcefcba85z:rjjjb8Aa8Ah8Wka8WaYfgYav9pmdxbkkaravcdtg8WfhLdnaITmbaPclfa8PcdtfydbhzaIhCinaLazydbfcb86bbazclfhzaCcufgCmbkkdnavaI9nmbaPclfa8PcdtfydbaIcdtfhzavaI9RhCinaLazydbfce86bbazclfhzaCcufgCmbkkcbhYindnaYa8PSmbcbhzaraPclfaYcdtfydbgKa8Wz:qjjjbhCavhXaIhOinaKaOazaLaCydbgQfRbbgAEcdtfaQBdbaCclfhCaOaAfhOazaA9RcefhzaXcufgXmbkkaYcefgYci9hmbkabaeadaialaIaocefgCarawaDaqakaxamz:hjjjbabaeaIcdtgzfadazfaiazfalaIfavaI9RaCarawaDaqakaxamz:hjjjbkaPc;qbf8Kjjjjbk:Seeru8Jjjjjbc:q;ab9Rgo8Kjjjjbaoc:q8WfcFecjzz:rjjjb8AcbhrdnadTmbaehwadhDinaoarcdtfawydbgqBdbaoc:q8WfaqcFiGcdtfgkydbhxakaqBdbawclfhwaraxaq9hfhraDcufgDmbkkabaeadaoaraiavz:jjjjbaoc:q;abf8Kjjjjbk;Sqloud99euD998Jjjjjbc:W;ab9Rgr8KjjjjbdndnadTmbaocd4hwcbhDcbhqindnavaeclfydbaw2cdtfgkIdbavaeydbaw2cdtfgxIdbgm:tgPavaecwfydbaw2cdtfgsIdlaxIdlgz:tgHNakIdlaz:tgOasIdbam:tgAN:tgCaCNaOasIdwaxIdwgX:tgQNakIdwaX:tgOaHN:tgHaHNaOaANaPaQN:tgPaPNMMgOJbbbb9Bmbarc8WfaDcltfgkaCaO:rgO:vgCUdwakaPaO:vgPUdlakaHaO:vgHUdbakaCaXNaHamNazaPNMM:mUdxaDcefhDkaecxfheaqcifgqad6mbkab9cb83dyab9cb83daab9cb83dKab9cb83dzab9cb83dwab9cb83dbaDTmearcbBd8Sar9cb83iKar9cb83izarczfavalaoarc8Sfcbcraiz:kjjjbarIdKhQarIdChLarIdzhKar9cb83iwar9cb83ibararc8WfaDczarc8Sfcbcicbz:kjjjbJbbbbhmdnarIdwgzazNarIdbgHaHNarIdlgXaXNMMgCJbbbb9BmbJbbjZaC:r:vhmkazamNhCaXamNhXaHamNhHJbbjZhmarc8WfheaDhvinaecwfIdbaCNaeIdbaHNaXaeclfIdbNMMgzamazam9DEhmaeczfheavcufgvmbkabaQUdwabaLUdlabaKUdbabarId3UdxdndnamJ;n;m;m899FmbJbbbbhzarc8WfheinaecxfIdbaQaecwfIdbgPNaKaeIdbgONaLaeclfIdbgANMMMaCaPNaHaONaXaANMM:vgPazaPaz9EEhzaeczfheaDcufgDmbkabaCUd8KabaXUdaabaHUd3abaQaCazN:tUdKabaLaXazN:tUdCabaKaHazN:tUdzabJbbjZamamN:t:rgmUdydndnaCJbbj:;aCJbbj:;9GEgzJbbjZazJbbjZ9FEJbb;:9cNJbbbZJbbb:;aCJbbbb9GEMgz:lJbbb9p9DTmbaz:Ohexekcjjjj94hekabae86b8UdndnaXJbbj:;aXJbbj:;9GEgzJbbjZazJbbjZ9FEJbb;:9cNJbbbZJbbb:;aXJbbbb9GEMgz:lJbbb9p9DTmbaz:Ohvxekcjjjj94hvkabav86bRdndnaHJbbj:;aHJbbj:;9GEgzJbbjZazJbbjZ9FEJbb;:9cNJbbbZJbbb:;aHJbbbb9GEMgz:lJbbb9p9DTmbaz:Ohwxekcjjjj94hwkabaw86b8SdndnaecKtcK91:YJbb;:9c:vaC:t:lavcKtcK91:YJbb;:9c:vaX:t:lawcKtcK91:YJbb;:9c:vaH:t:lamMMMJbb;:9cNJbbjZMgm:lJbbb9p9DTmbam:Ohexekcjjjj94hekaecFbaecFb9iEhexekabcjjj;8iBdycFbhekabae86b8Vxekab9cb83dyab9cb83daab9cb83dKab9cb83dzab9cb83dwab9cb83dbkarc:W;abf8Kjjjjbk;7woDuo99eue99euv998Jjjjjbcje9Rgw8Kjjjjbawc;abfcbaocdtgDz:rjjjb8Aawc;GbfcbaDz:rjjjb8AawcafhDawhqaohkinaqcFFF97BdbaDcFFF;7rBdbaqclfhqaDclfhDakcufgkmbkavcd4hxaicd4hmdnadTmbaocx2hPcbhsinashzdnarTmbarascdtfydbhzkaeazam2cdtfgDIdwhHaDIdlhOaDIdbhAalazax2cdtfIdbhCcbhDawcafhqawc;Gbfhvawhkawc;abfhiinaCaDc:O:G:cjbfIdbaHNaDc:G:G:cjbfIdbaANaDc:K:G:cjbfIdbaONMMgXMhQazhLdnaXaC:tgXaqIdbgK9DgYmbavydbhLkavaLBdbazhLdnaQakIdbg8A9EmbaiydbhLa8AhQkaiaLBdbakaQUdbaqaXaKaYEUdbaiclfhiakclfhkavclfhvaqclfhqaPaDcxfgD9hmbkascefgsad9hmbkkJbbbbhQcbhLawc;GbfhDawc;abfhqcbhkinalaqydbgvax2cdtfIdbalaDydbgiax2cdtfIdbaeavam2cdtfgvIdwaeaiam2cdtfgiIdw:tgCaCNavIdbaiIdb:tgCaCNavIdlaiIdl:tgCaCNMM:rMMgCaQaCaQ9EgvEhQakaLavEhLaqclfhqaDclfhDaoakcefgk9hmbkJbbbbhCdnaeawc;abfaLcdtgqfydbgkam2cdtfgDIdwaeawc;Gbfaqfydbgvam2cdtfgqIdwgH:tgXaXNaDIdbaqIdbgA:tg8Aa8ANaDIdlaqIdlgE:tgOaONMMgKJbbbb9ETmbaK:rgCalakax2cdtfIdbMalavax2cdtfIdb:taCaCM:vhCkaQJbbbZNhKaXaCNaHMhHaOaCNaEMhOa8AaCNaAMhAdnadTmbcbhqarhkinaqhDdnarTmbakydbhDkdnalaDax2cdtfIdbg3aeaDam2cdtfgDIdwaH:tgQaQNaDIdbaA:tgCaCNaDIdlaO:tgXaXNMMg5:rgEMg8EaK9ETmbJbbbbh8Adna5Jbbbb9ETmba8EaK:taEaEM:vh8Aka8AaQNaHMhHa8AaXNaOMhOa8AaCNaAMhAa3aKaEMMJbbbZNhKkakclfhkadaqcefgq9hmbkkabaKUdxabaHUdwabaOUdlabaAUdbawcjef8Kjjjjbk:reevu8Jjjjjbcj8W9Rgr8Kjjjjbaici2hwcbhDdnaiTmbarhiawhqinaiaeadRbbgkcdtfydbBdbaDakcefgkaDak0EhDaiclfhiadcefhdaqcufgqmbkkabarawaeaDalaoz:jjjjbarcj8Wf8Kjjjjbk:Eeeeu8Jjjjjbca9Rgo8Kjjjjbab9cb83dyab9cb83daab9cb83dKab9cb83dzab9cb83dwab9cb83dbdnadTmbaocbBd3ao9cb83iwao9cb83ibaoaeadaialaoc3falEavcbalEcrcbz:kjjjbabao8Pib83dbabao8Piw83dwkaocaf8Kjjjjbk::meQu8Jjjjjbcjz9Rgv8KjjjjbcbhoavcjPfcbaez:rjjjb8Aavcjxfcbaez:rjjjb8AdnaiTmbadhoaihrinavcjxfaoRbbfgwawRbbcef86bbavcjxfaocefRbbfgwawRbbcef86bbavcjxfaocdfRbbfgwawRbbcef86bbaocifhoarcufgrmbkcbhDcjehoadhqcehkindndnalTmbcbhxcuhmaqhrakhwcuhPinawcufamaoavcjPfarcefRbbgsfRbb9RcFeGgzci6aoavcjPfarRbbgHfRbb9RcFeGgOci6faoavcjPfarcdfRbbgAfRbb9RcFeGgCci6fgXcOtaOcFr7azaCf9RcwtVavcjxfaAfRbbgzavcjxfaHfRbbgHavcjxfasfRbbgsaHas6Egsazas6EcFe7VgsaP9kgzEhmaXcd6gHaxcefgOal9iVce9hmdasaPazEhPaxaOaHEhxarcifhrawai6hsawcefhwasmbxdkkcuhmaqhrakhwcuhxinawcufamaoavcjPfarcefRbbfRbb9RcFeGci6aoavcjPfarRbbfRbb9RcFeGci6faoavcjPfarcdfRbbfRbb9RcFeGci6fgPax9kgsEhmaPce0meaPaxasEhxarcifhrawai6hPawcefhwaPmbkkadamci2fgrcdfRbbhwarcefRbbhxarRbbhPadaDci2fgrcifaramaD9Rci2zNjjjb8AaPavcjPffaocefgo86bbaPavcjxffgmamRbbcuf86bbaxavcjPffao86bbaxavcjxffgmamRbbcuf86bbarcdfaw86bbarcefax86bbaraP86bbawavcjPffao86bbawavcjxffgrarRbbcuf86bbaqcifhqakcefhkaDcefgDai9hmbkcbhzdnalcb9mmbcbhsavcjPfcbaez:rjjjb8Aadcvfhlinadasci2fgxcefgDRbbhoaxcdfgqRbbhrdndnavcjPfaxRbbgmfRbbmbavcjPfarfRbbhwdndndnavcjPfaofRbbTmbawcFeGTmexikawcFeGmdascefgAai9pmdasc980mdascifhQcbhLarcFeGhCamcFeGhXalhwcbhKcbhYinawcufRbbhPawRbbhOcehkdndnawc9:fRbbgHao9hmbaPcFeGamSmekdnaPcFeGao9hmbaOcFeGamSmekaHamSaOcFeGaoSGhkkceh8AaYceGhYdndnaHar9hmbaPcFeGaoSmekdnaPcFeGar9hmbaOcFeGaoSmekaHaoSaOcFeGarSGh8AkakaYVhYaLaHcFeGgHaXSaPcFeGgPaCSGaPaXSaOcFeGgPaCSGVaHaCSaPaXSGVVhLa8AaKceGVhKdnaAcefgPai9pmbawcifhwaAaQ6hHaPhAaHmekkaYTmeaKmekarhwaohPaohHarhOamhrxdkdnaYTaLVceGTmbaYaKTVaLVceGmekamhwarhParhHamhOaohrxekaohwamhPamhHaohOkavcjPfarfce86bbavcjPfawfce86bbaxaH86bbaqar86bbaDaO86bbavcjPfaPfce86bbalcifhlascefgsai9hmbkkavcFeaecetz:rjjjbhwaici2hrindnawadRbbgmcetfgx8Uebgocu9kmbaxaz87ebawcjlfazcdtfabamcdtfydbBdbazhoazcefhzkadao86bbadcefhdarcufgrmbkazcdthokabavcjlfaoz:qjjjb8Aavcjzf8KjjjjbkObabaiaeadcbz:njjjbk9teiucbcbyd;8:G:cjbgeabcifc98GfgbBd;8:G:cjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaeczfheaiczfhiadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabk9teiucbcbyd;8:G:cjbgeabcrfc94GfgbBd;8:G:cjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikTeeucbabcbyd;8:G:cjbge9Rcifc98GaefgbBd;8:G:cjbdnabZbcztge9nmbabae9RcFFifcz4nb8Akk:3qeludndnadch6mbadTmeabaead;8qbbabskabaeSmbdnaeadabfgi9Rcbadcet9R0mbadTmeabaead;8qbbabskaeab7ciGhldndndnabae9pmbdnalTmbadhvabhixikdnabciGmbadhvabhixdkadTmiabaeRbb86bbadcufhvdnabcefgiciGmbaecefhexdkavTmiabaeRbe86beadc9:fhvdnabcdfgiciGmbaecdfhexdkavTmiabaeRbd86bdadc99fhvdnabcifgiciGmbaecifhexdkavTmiabaeRbi86biabclfhiaeclfheadc98fhvxekdnalmbdnaiciGTmbadTmlabadcufgifglaeaifRbb86bbdnalciGmbaihdxekaiTmlabadc9:fgifglaeaifRbb86bbdnalciGmbaihdxekaiTmlabadc99fgifglaeaifRbb86bbdnalciGmbaihdxekaiTmlabadc98fgdfaeadfRbb86bbkadcl6mbdnadc98fgocxGcxSmbaocd4cefciGhiaec98fhlabc98fhvinavadfaladfydbBdbadc98fhdaicufgimbkkaocx6mbaec9Wfhvabc9WfhoinaoadfgicxfavadfglcxfydbBdbaicwfalcwfydbBdbaiclfalclfydbBdbaialydbBdbadc9Wfgdci0mbkkadTmdadhidnadciGglTmbaecufhvabcufhoadhiinaoaifavaifRbb86bbaicufhialcufglmbkkadcl6mdaec98fhlabc98fhvinavaifgecifalaifgdcifRbb86bbaecdfadcdfRbb86bbaecefadcefRbb86bbaeadRbb86bbaic98fgimbxikkavcl6mbdnavc98fglc3Gc3Smbavalcd4cefcrGgdcdt9RhvinaiaeydbBdbaeclfheaiclfhiadcufgdmbkkalc36mbinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaiczfaeczfydbBdbaicCfaecCfydbBdbaicKfaecKfydbBdbaic3faec3fydbBdbaecafheaicafhiavc9Gfgvci0mbkkavTmbdndnavcrGgdmbavhlxekavc94GhlinaiaeRbb86bbaicefhiaecefheadcufgdmbkkavcw6mbinaiaeRbb86bbaicefaecefRbb86bbaicdfaecdfRbb86bbaicifaecifRbb86bbaiclfaeclfRbb86bbaicvfaecvfRbb86bbaicofaecofRbb86bbaicrfaecrfRbb86bbaicwfhiaecwfhealc94fglmbkkabkk:pedbcj:GdktFFuuFFuuFFuubbbbFFuFFFuFFFuFbbbbbbjZbbbbbbbbbbbbbbjZbbbbbbbbbbbbbbjZ86;nAZ86;nAZ86;nAZ86;nA:;86;nAZ86;nAZ86;nAZ86;nA:;86;nAZ86;nAZ86;nAZ86;nA:;bc;0:Gdkxebbbdbbbj:qbb";
  var wasmpack = new Uint8Array([
    32,
    0,
    65,
    2,
    1,
    106,
    34,
    33,
    3,
    128,
    11,
    4,
    13,
    64,
    6,
    253,
    10,
    7,
    15,
    116,
    127,
    5,
    8,
    12,
    40,
    16,
    19,
    54,
    20,
    9,
    27,
    255,
    113,
    17,
    42,
    67,
    24,
    23,
    146,
    148,
    18,
    14,
    22,
    45,
    70,
    69,
    56,
    114,
    101,
    21,
    25,
    63,
    75,
    136,
    108,
    28,
    118,
    29,
    73,
    115
  ]);
  if (typeof WebAssembly !== "object") {
    return {
      supported: false
    };
  }
  var instance;
  var ready = WebAssembly.instantiate(unpack(wasm), {}).then(function(result) {
    instance = result.instance;
    instance.exports.__wasm_call_ctors();
  });
  function unpack(data) {
    var result = new Uint8Array(data.length);
    for (var i = 0; i < data.length; ++i) {
      var ch = data.charCodeAt(i);
      result[i] = ch > 96 ? ch - 97 : ch > 64 ? ch - 39 : ch + 4;
    }
    var write = 0;
    for (var i = 0; i < data.length; ++i) {
      result[write++] = result[i] < 60 ? wasmpack[result[i]] : (result[i] - 60) * 64 + result[++i];
    }
    return result.buffer.slice(0, write);
  }
  function assert(cond) {
    if (!cond) {
      throw new Error("Assertion failed");
    }
  }
  function bytes(view) {
    return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
  }
  var BOUNDS_SIZE = 48;
  var MESHLET_SIZE = 16;
  function extractMeshlet(buffers, index) {
    var vertex_offset = buffers.meshlets[index * 4 + 0];
    var triangle_offset = buffers.meshlets[index * 4 + 1];
    var vertex_count = buffers.meshlets[index * 4 + 2];
    var triangle_count = buffers.meshlets[index * 4 + 3];
    return {
      vertices: buffers.vertices.subarray(vertex_offset, vertex_offset + vertex_count),
      triangles: buffers.triangles.subarray(triangle_offset, triangle_offset + triangle_count * 3)
    };
  }
  function buildMeshlets(fun, indices, vertex_positions, vertex_count, vertex_positions_stride, max_vertices, min_triangles, max_triangles, parama, paramb) {
    var sbrk = instance.exports.sbrk;
    var max_meshlets = instance.exports.meshopt_buildMeshletsBound(indices.length, max_vertices, min_triangles);
    var meshletsp = sbrk(max_meshlets * MESHLET_SIZE);
    var meshlet_verticesp = sbrk(indices.length * 4);
    var meshlet_trianglesp = sbrk(indices.length);
    var indicesp = sbrk(indices.byteLength);
    var verticesp = sbrk(vertex_positions.byteLength);
    var heap = new Uint8Array(instance.exports.memory.buffer);
    heap.set(bytes(indices), indicesp);
    heap.set(bytes(vertex_positions), verticesp);
    var count = fun(
      meshletsp,
      meshlet_verticesp,
      meshlet_trianglesp,
      indicesp,
      indices.length,
      verticesp,
      vertex_count,
      vertex_positions_stride,
      max_vertices,
      min_triangles,
      max_triangles,
      parama,
      paramb
    );
    heap = new Uint8Array(instance.exports.memory.buffer);
    var meshletBytes = heap.subarray(meshletsp, meshletsp + count * MESHLET_SIZE);
    var meshlets = new Uint32Array(meshletBytes.buffer, meshletBytes.byteOffset, meshletBytes.byteLength / 4).slice();
    for (var i = 0; i < count; ++i) {
      var vertex_offset = meshlets[i * 4 + 0];
      var triangle_offset = meshlets[i * 4 + 1];
      var vertex_count = meshlets[i * 4 + 2];
      var triangle_count = meshlets[i * 4 + 3];
      instance.exports.meshopt_optimizeMeshlet(
        meshlet_verticesp + vertex_offset * 4,
        meshlet_trianglesp + triangle_offset,
        triangle_count,
        vertex_count
      );
    }
    var used_vertices = count ? meshlets[(count - 1) * 4 + 0] + meshlets[(count - 1) * 4 + 2] : 0;
    var used_triangles = count ? meshlets[(count - 1) * 4 + 1] + meshlets[(count - 1) * 4 + 3] * 3 : 0;
    var result = {
      meshlets,
      vertices: new Uint32Array(heap.buffer, meshlet_verticesp, used_vertices).slice(),
      triangles: new Uint8Array(heap.buffer, meshlet_trianglesp, used_triangles).slice(),
      meshletCount: count
    };
    sbrk(meshletsp - sbrk(0));
    return result;
  }
  function extractBounds(boundsp) {
    var bounds_floats = new Float32Array(instance.exports.memory.buffer, boundsp, BOUNDS_SIZE / 4);
    return {
      centerX: bounds_floats[0],
      centerY: bounds_floats[1],
      centerZ: bounds_floats[2],
      radius: bounds_floats[3],
      coneApexX: bounds_floats[4],
      coneApexY: bounds_floats[5],
      coneApexZ: bounds_floats[6],
      coneAxisX: bounds_floats[7],
      coneAxisY: bounds_floats[8],
      coneAxisZ: bounds_floats[9],
      coneCutoff: bounds_floats[10]
    };
  }
  function computeMeshletBounds(buffers, vertex_positions, vertex_count, vertex_positions_stride) {
    var sbrk = instance.exports.sbrk;
    var results = [];
    var verticesp = sbrk(vertex_positions.byteLength);
    var meshlet_verticesp = sbrk(buffers.vertices.byteLength);
    var meshlet_trianglesp = sbrk(buffers.triangles.byteLength);
    var resultp = sbrk(BOUNDS_SIZE);
    var heap = new Uint8Array(instance.exports.memory.buffer);
    heap.set(bytes(vertex_positions), verticesp);
    heap.set(bytes(buffers.vertices), meshlet_verticesp);
    heap.set(bytes(buffers.triangles), meshlet_trianglesp);
    for (var i = 0; i < buffers.meshletCount; ++i) {
      var vertex_offset = buffers.meshlets[i * 4 + 0];
      var triangle_offset = buffers.meshlets[i * 4 + 1];
      var triangle_count = buffers.meshlets[i * 4 + 3];
      instance.exports.meshopt_computeMeshletBounds(
        resultp,
        meshlet_verticesp + vertex_offset * 4,
        meshlet_trianglesp + triangle_offset,
        triangle_count,
        verticesp,
        vertex_count,
        vertex_positions_stride
      );
      results.push(extractBounds(resultp));
    }
    sbrk(verticesp - sbrk(0));
    return results;
  }
  function computeClusterBounds(indices, vertex_positions, vertex_count, vertex_positions_stride) {
    var sbrk = instance.exports.sbrk;
    var resultp = sbrk(BOUNDS_SIZE);
    var indicesp = sbrk(indices.byteLength);
    var verticesp = sbrk(vertex_positions.byteLength);
    var heap = new Uint8Array(instance.exports.memory.buffer);
    heap.set(bytes(indices), indicesp);
    heap.set(bytes(vertex_positions), verticesp);
    instance.exports.meshopt_computeClusterBounds(resultp, indicesp, indices.length, verticesp, vertex_count, vertex_positions_stride);
    var result = extractBounds(resultp);
    sbrk(resultp - sbrk(0));
    return result;
  }
  function computeSphereBounds(positions, count, positions_stride, radii, radii_stride) {
    var sbrk = instance.exports.sbrk;
    var resultp = sbrk(BOUNDS_SIZE);
    var positionsp = sbrk(positions.byteLength);
    var radiip = radii ? sbrk(radii.byteLength) : 0;
    var heap = new Uint8Array(instance.exports.memory.buffer);
    heap.set(bytes(positions), positionsp);
    if (radii) {
      heap.set(bytes(radii), radiip);
    }
    instance.exports.meshopt_computeSphereBounds(resultp, positionsp, count, positions_stride, radiip, radii ? radii_stride : 0);
    var result = extractBounds(resultp);
    sbrk(resultp - sbrk(0));
    return result;
  }
  return {
    ready,
    supported: true,
    buildMeshlets: function(indices, vertex_positions, vertex_positions_stride, max_vertices, max_triangles, cone_weight) {
      assert(indices.length % 3 == 0);
      assert(vertex_positions instanceof Float32Array);
      assert(vertex_positions.length % vertex_positions_stride == 0);
      assert(vertex_positions_stride >= 3);
      assert(max_vertices >= 3 && max_vertices <= 256);
      assert(max_triangles >= 1 && max_triangles <= 512);
      cone_weight = cone_weight || 0;
      var indices32 = indices.BYTES_PER_ELEMENT == 4 ? indices : new Uint32Array(indices);
      return buildMeshlets(
        instance.exports.meshopt_buildMeshletsFlex,
        indices32,
        vertex_positions,
        vertex_positions.length / vertex_positions_stride,
        vertex_positions_stride * 4,
        max_vertices,
        max_triangles,
        max_triangles,
        cone_weight,
        0
      );
    },
    buildMeshletsFlex: function(indices, vertex_positions, vertex_positions_stride, max_vertices, min_triangles, max_triangles, cone_weight, split_factor) {
      assert(indices.length % 3 == 0);
      assert(vertex_positions instanceof Float32Array);
      assert(vertex_positions.length % vertex_positions_stride == 0);
      assert(vertex_positions_stride >= 3);
      assert(max_vertices >= 3 && max_vertices <= 256);
      assert(min_triangles >= 1 && max_triangles <= 512);
      assert(min_triangles <= max_triangles);
      cone_weight = cone_weight || 0;
      split_factor = split_factor || 0;
      var indices32 = indices.BYTES_PER_ELEMENT == 4 ? indices : new Uint32Array(indices);
      return buildMeshlets(
        instance.exports.meshopt_buildMeshletsFlex,
        indices32,
        vertex_positions,
        vertex_positions.length / vertex_positions_stride,
        vertex_positions_stride * 4,
        max_vertices,
        min_triangles,
        max_triangles,
        cone_weight,
        split_factor
      );
    },
    buildMeshletsSpatial: function(indices, vertex_positions, vertex_positions_stride, max_vertices, min_triangles, max_triangles, fill_weight) {
      assert(indices.length % 3 == 0);
      assert(vertex_positions instanceof Float32Array);
      assert(vertex_positions.length % vertex_positions_stride == 0);
      assert(vertex_positions_stride >= 3);
      assert(max_vertices >= 3 && max_vertices <= 256);
      assert(min_triangles >= 1 && max_triangles <= 512);
      assert(min_triangles <= max_triangles);
      fill_weight = fill_weight || 0;
      var indices32 = indices.BYTES_PER_ELEMENT == 4 ? indices : new Uint32Array(indices);
      return buildMeshlets(
        instance.exports.meshopt_buildMeshletsSpatial,
        indices32,
        vertex_positions,
        vertex_positions.length / vertex_positions_stride,
        vertex_positions_stride * 4,
        max_vertices,
        min_triangles,
        max_triangles,
        fill_weight
      );
    },
    extractMeshlet: function(buffers, index) {
      assert(index >= 0 && index < buffers.meshletCount);
      return extractMeshlet(buffers, index);
    },
    computeClusterBounds: function(indices, vertex_positions, vertex_positions_stride) {
      assert(indices.length % 3 == 0);
      assert(indices.length / 3 <= 512);
      assert(vertex_positions instanceof Float32Array);
      assert(vertex_positions.length % vertex_positions_stride == 0);
      assert(vertex_positions_stride >= 3);
      var indices32 = indices.BYTES_PER_ELEMENT == 4 ? indices : new Uint32Array(indices);
      return computeClusterBounds(indices32, vertex_positions, vertex_positions.length / vertex_positions_stride, vertex_positions_stride * 4);
    },
    computeMeshletBounds: function(buffers, vertex_positions, vertex_positions_stride) {
      assert(vertex_positions instanceof Float32Array);
      assert(vertex_positions.length % vertex_positions_stride == 0);
      assert(vertex_positions_stride >= 3);
      return computeMeshletBounds(buffers, vertex_positions, vertex_positions.length / vertex_positions_stride, vertex_positions_stride * 4);
    },
    computeSphereBounds: function(positions, positions_stride, radii, radii_stride) {
      assert(positions instanceof Float32Array);
      assert(positions.length % positions_stride == 0);
      assert(positions_stride >= 3);
      assert(!radii || radii instanceof Float32Array);
      assert(!radii || radii.length % radii_stride == 0);
      assert(!radii || radii_stride >= 1);
      assert(!radii || positions.length / positions_stride == radii.length / radii_stride);
      radii_stride = radii_stride || 0;
      return computeSphereBounds(positions, positions.length / positions_stride, positions_stride * 4, radii, radii_stride * 4);
    }
  };
})();

// packages/engine/Source/Scene/Axis.js
var Axis = {
  /**
   * Denotes the x-axis.
   *
   * @type {number}
   * @constant
   */
  X: 0,
  /**
   * Denotes the y-axis.
   *
   * @type {number}
   * @constant
   */
  Y: 1,
  /**
   * Denotes the z-axis.
   *
   * @type {number}
   * @constant
   */
  Z: 2
};
Axis.Y_UP_TO_Z_UP = Matrix4_default.fromRotationTranslation(
  // Rotation about PI/2 around the X-axis
  Matrix3_default.fromArray([1, 0, 0, 0, 0, 1, 0, -1, 0])
);
Axis.Z_UP_TO_Y_UP = Matrix4_default.fromRotationTranslation(
  // Rotation about -PI/2 around the X-axis
  Matrix3_default.fromArray([1, 0, 0, 0, 0, -1, 0, 1, 0])
);
Axis.X_UP_TO_Z_UP = Matrix4_default.fromRotationTranslation(
  // Rotation about -PI/2 around the Y-axis
  Matrix3_default.fromArray([0, 0, 1, 0, 1, 0, -1, 0, 0])
);
Axis.Z_UP_TO_X_UP = Matrix4_default.fromRotationTranslation(
  // Rotation about PI/2 around the Y-axis
  Matrix3_default.fromArray([0, 0, -1, 0, 1, 0, 1, 0, 0])
);
Axis.X_UP_TO_Y_UP = Matrix4_default.fromRotationTranslation(
  // Rotation about PI/2 around the Z-axis
  Matrix3_default.fromArray([0, 1, 0, -1, 0, 0, 0, 0, 1])
);
Axis.Y_UP_TO_X_UP = Matrix4_default.fromRotationTranslation(
  // Rotation about -PI/2 around the Z-axis
  Matrix3_default.fromArray([0, -1, 0, 1, 0, 0, 0, 0, 1])
);
Axis.fromName = function(name) {
  Check_default.typeOf.string("name", name);
  return Axis[name];
};
Object.freeze(Axis);
var Axis_default = Axis;

// packages/engine/Source/Scene/SceneMode.js
var SceneMode = {
  /**
   * Morphing between mode, e.g., 3D to 2D.
   *
   * @type {number}
   * @constant
   */
  MORPHING: 0,
  /**
   * Columbus View mode.  A 2.5D perspective view where the map is laid out
   * flat and objects with non-zero height are drawn above it.
   *
   * @type {number}
   * @constant
   */
  COLUMBUS_VIEW: 1,
  /**
   * 2D mode.  The map is viewed top-down with an orthographic projection.
   *
   * @type {number}
   * @constant
   */
  SCENE2D: 2,
  /**
   * 3D mode.  A traditional 3D perspective view of the globe.
   *
   * @type {number}
   * @constant
   */
  SCENE3D: 3
};
SceneMode.getMorphTime = function(value) {
  if (value === SceneMode.SCENE3D) {
    return 1;
  } else if (value === SceneMode.MORPHING) {
    return void 0;
  }
  return 0;
};
Object.freeze(SceneMode);
var SceneMode_default = SceneMode;

// packages/engine/Source/Core/TaskProcessor.js
var import_urijs = __toESM(require_URI(), 1);

// packages/engine/Source/Core/destroyObject.js
function returnTrue() {
  return true;
}
function destroyObject(object, message) {
  message = message ?? "This object was destroyed, i.e., destroy() was called.";
  function throwOnDestroyed() {
    throw new DeveloperError_default(message);
  }
  for (const key in object) {
    if (typeof object[key] === "function") {
      object[key] = throwOnDestroyed;
    }
  }
  object.isDestroyed = returnTrue;
  return void 0;
}
var destroyObject_default = destroyObject;

// packages/engine/Source/Core/TaskProcessor.js
function canTransferArrayBuffer() {
  if (!defined_default(TaskProcessor._canTransferArrayBuffer)) {
    const worker = createWorker("transferTypedArrayTest");
    worker.postMessage = worker.webkitPostMessage ?? worker.postMessage;
    const value = 99;
    const array = new Int8Array([value]);
    try {
      worker.postMessage(
        {
          array
        },
        [array.buffer]
      );
    } catch (e) {
      TaskProcessor._canTransferArrayBuffer = false;
      return TaskProcessor._canTransferArrayBuffer;
    }
    TaskProcessor._canTransferArrayBuffer = new Promise((resolve) => {
      worker.onmessage = function(event) {
        const array2 = event.data.array;
        const result = defined_default(array2) && array2[0] === value;
        resolve(result);
        worker.terminate();
        TaskProcessor._canTransferArrayBuffer = result;
      };
    });
  }
  return TaskProcessor._canTransferArrayBuffer;
}
var taskCompletedEvent = new Event_default();
function urlFromScript(script) {
  let blob;
  try {
    blob = new Blob([script], {
      type: "application/javascript"
    });
  } catch (e) {
    const BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
    const blobBuilder = new BlobBuilder();
    blobBuilder.append(script);
    blob = blobBuilder.getBlob("application/javascript");
  }
  const URL2 = window.URL || window.webkitURL;
  return URL2.createObjectURL(blob);
}
function createWorker(url) {
  const uri = new import_urijs.default(url);
  const isUri = uri.scheme().length !== 0 && uri.fragment().length === 0;
  const moduleID = url.replace(/\.js$/, "");
  const options = {};
  let workerPath;
  let crossOriginUrl;
  if (isCrossOriginUrl_default(url)) {
    crossOriginUrl = url;
  } else if (!isUri) {
    const moduleAbsoluteUrl = buildModuleUrl_default(
      `${TaskProcessor._workerModulePrefix}/${moduleID}.js`
    );
    if (isCrossOriginUrl_default(moduleAbsoluteUrl)) {
      crossOriginUrl = moduleAbsoluteUrl;
    }
  }
  if (crossOriginUrl) {
    const script = `import "${crossOriginUrl}";`;
    workerPath = urlFromScript(script);
    options.type = "module";
    return new Worker(workerPath, options);
  }
  if (!isUri && typeof CESIUM_WORKERS !== "undefined") {
    const script = `
      importScripts("${urlFromScript(CESIUM_WORKERS)}");
      CesiumWorkers["${moduleID}"]();
    `;
    workerPath = urlFromScript(script);
    return new Worker(workerPath, options);
  }
  workerPath = url;
  if (!isUri) {
    workerPath = buildModuleUrl_default(
      `${TaskProcessor._workerModulePrefix + moduleID}.js`
    );
  }
  if (!FeatureDetection_default.supportsEsmWebWorkers()) {
    throw new RuntimeError_default(
      "This browser is not supported. Please update your browser to continue."
    );
  }
  options.type = "module";
  return new Worker(workerPath, options);
}
async function getWebAssemblyLoaderConfig(processor, wasmOptions) {
  const config = {
    modulePath: void 0,
    wasmBinaryFile: void 0,
    wasmBinary: void 0
  };
  if (!FeatureDetection_default.supportsWebAssembly()) {
    if (!defined_default(wasmOptions.fallbackModulePath)) {
      throw new RuntimeError_default(
        `This browser does not support Web Assembly, and no backup module was provided for ${processor._workerPath}`
      );
    }
    config.modulePath = buildModuleUrl_default(wasmOptions.fallbackModulePath);
    return config;
  }
  config.wasmBinaryFile = buildModuleUrl_default(wasmOptions.wasmBinaryFile);
  const arrayBuffer = await Resource_default.fetchArrayBuffer({
    url: config.wasmBinaryFile
  });
  config.wasmBinary = arrayBuffer;
  return config;
}
function TaskProcessor(workerPath, maximumActiveTasks) {
  this._workerPath = workerPath;
  this._maximumActiveTasks = maximumActiveTasks ?? Number.POSITIVE_INFINITY;
  this._activeTasks = 0;
  this._nextID = 0;
  this._webAssemblyPromise = void 0;
}
var createOnmessageHandler = (worker, id, resolve, reject) => {
  const listener = ({ data }) => {
    if (data.id !== id) {
      return;
    }
    if (defined_default(data.error)) {
      let error = data.error;
      if (error.name === "RuntimeError") {
        error = new RuntimeError_default(data.error.message);
        error.stack = data.error.stack;
      } else if (error.name === "DeveloperError") {
        error = new DeveloperError_default(data.error.message);
        error.stack = data.error.stack;
      } else if (error.name === "Error") {
        error = new Error(data.error.message);
        error.stack = data.error.stack;
      }
      taskCompletedEvent.raiseEvent(error);
      reject(error);
    } else {
      taskCompletedEvent.raiseEvent();
      resolve(data.result);
    }
    worker.removeEventListener("message", listener);
  };
  return listener;
};
var emptyTransferableObjectArray = [];
async function runTask(processor, parameters, transferableObjects) {
  const canTransfer = await Promise.resolve(canTransferArrayBuffer());
  if (!defined_default(transferableObjects)) {
    transferableObjects = emptyTransferableObjectArray;
  } else if (!canTransfer) {
    transferableObjects.length = 0;
  }
  const id = processor._nextID++;
  const promise = new Promise((resolve, reject) => {
    processor._worker.addEventListener(
      "message",
      createOnmessageHandler(processor._worker, id, resolve, reject)
    );
  });
  processor._worker.postMessage(
    {
      id,
      baseUrl: buildModuleUrl_default.getCesiumBaseUrl().url,
      parameters,
      canTransferArrayBuffer: canTransfer
    },
    transferableObjects
  );
  return promise;
}
async function scheduleTask(processor, parameters, transferableObjects) {
  ++processor._activeTasks;
  try {
    const result = await runTask(processor, parameters, transferableObjects);
    --processor._activeTasks;
    return result;
  } catch (error) {
    --processor._activeTasks;
    throw error;
  }
}
TaskProcessor.prototype.scheduleTask = function(parameters, transferableObjects) {
  if (!defined_default(this._worker)) {
    this._worker = createWorker(this._workerPath);
  }
  if (this._activeTasks >= this._maximumActiveTasks) {
    return void 0;
  }
  return scheduleTask(this, parameters, transferableObjects);
};
TaskProcessor.prototype.initWebAssemblyModule = async function(webAssemblyOptions) {
  if (defined_default(this._webAssemblyPromise)) {
    return this._webAssemblyPromise;
  }
  const init = async () => {
    const worker = this._worker = createWorker(this._workerPath);
    const wasmConfig = await getWebAssemblyLoaderConfig(
      this,
      webAssemblyOptions
    );
    const canTransfer = await Promise.resolve(canTransferArrayBuffer());
    let transferableObjects;
    const binary = wasmConfig.wasmBinary;
    if (defined_default(binary) && canTransfer) {
      transferableObjects = [binary];
    }
    const promise = new Promise((resolve, reject) => {
      worker.onmessage = function({ data }) {
        if (defined_default(data)) {
          resolve(data.result);
        } else {
          reject(new RuntimeError_default("Could not configure wasm module"));
        }
      };
    });
    worker.postMessage(
      {
        canTransferArrayBuffer: canTransfer,
        parameters: { webAssemblyConfig: wasmConfig }
      },
      transferableObjects
    );
    return promise;
  };
  this._webAssemblyPromise = init();
  return this._webAssemblyPromise;
};
TaskProcessor.prototype.isDestroyed = function() {
  return false;
};
TaskProcessor.prototype.destroy = function() {
  if (defined_default(this._worker)) {
    this._worker.terminate();
  }
  return destroyObject_default(this);
};
TaskProcessor.taskCompletedEvent = taskCompletedEvent;
TaskProcessor._defaultWorkerModulePrefix = "Workers/";
TaskProcessor._workerModulePrefix = TaskProcessor._defaultWorkerModulePrefix;
TaskProcessor._canTransferArrayBuffer = void 0;
var TaskProcessor_default = TaskProcessor;

// packages/engine/Source/Core/TerrainPicker.js
var MAXIMUM_TERRAIN_PICKER_LEVEL = 3;
function TerrainPicker(vertices, indices, encoding) {
  Check_default.defined("vertices", vertices);
  Check_default.defined("indices", indices);
  Check_default.defined("encoding", encoding);
  this._vertices = vertices;
  this._indices = indices;
  this._encoding = encoding;
  this._inverseTransform = new Matrix4_default();
  this._needsRebuild = true;
  this._rootNode = new TerrainPickerNode();
}
var incrementallyBuildTerrainPickerTaskProcessor = new TaskProcessor_default(
  "incrementallyBuildTerrainPicker"
);
Object.defineProperties(TerrainPicker.prototype, {
  /**
   * Indicates whether the terrain picker needs to be rebuilt due to changes in the underlying terrain mesh's vertices or indices.
   * @memberof TerrainPicker.prototype
   * @type {boolean}
   */
  needsRebuild: {
    get: function() {
      return this._needsRebuild;
    },
    set: function(value) {
      this._needsRebuild = value;
    }
  }
});
function TerrainPickerNode() {
  this.x = 0;
  this.y = 0;
  this.level = 0;
  this.aabb = createAABBForNode(this.x, this.y, this.level);
  this.intersectingTriangles = new Uint32Array(0);
  this.children = [];
  this.buildingChildren = false;
}
TerrainPickerNode.prototype.addChild = function(childIdx) {
  if (childIdx < 0 || childIdx > 3) {
    throw new DeveloperError_default(
      "TerrainPickerNode child index must be between 0 and 3, inclusive."
    );
  }
  const childNode = new TerrainPickerNode();
  childNode.x = this.x * 2 + (childIdx & 1);
  childNode.y = this.y * 2 + (childIdx >> 1 & 1);
  childNode.level = this.level + 1;
  childNode.aabb = createAABBForNode(childNode.x, childNode.y, childNode.level);
  this.children[childIdx] = childNode;
};
var scratchTransformedRay = new Ray_default();
var scratchTrianglePoints = [
  new Cartesian3_default(),
  new Cartesian3_default(),
  new Cartesian3_default()
];
TerrainPicker.prototype.rayIntersect = function(ray, tileTransform, cullBackFaces, mode, projection) {
  if (this._needsRebuild) {
    reset(this, tileTransform);
  }
  const invTransform = this._inverseTransform;
  const transformedRay = scratchTransformedRay;
  transformedRay.origin = Matrix4_default.multiplyByPoint(
    invTransform,
    ray.origin,
    transformedRay.origin
  );
  transformedRay.direction = Matrix4_default.multiplyByPointAsVector(
    invTransform,
    ray.direction,
    transformedRay.direction
  );
  const intersections = [];
  getNodesIntersectingRay(this._rootNode, transformedRay, intersections);
  return findClosestPointInClosestNode(
    this,
    intersections,
    ray,
    cullBackFaces,
    mode,
    projection
  );
};
function reset(terrainPicker, tileTransform) {
  Matrix4_default.inverse(tileTransform, terrainPicker._inverseTransform);
  terrainPicker._needsRebuild = false;
  const triangleCount = terrainPicker._indices.length / 3;
  const intersectingTriangles = new Uint32Array(triangleCount);
  for (let i = 0; i < triangleCount; ++i) {
    intersectingTriangles[i] = i;
  }
  terrainPicker._rootNode.intersectingTriangles = intersectingTriangles;
  terrainPicker._rootNode.children.length = 0;
}
var scratchAABBMin = new Cartesian3_default();
var scratchAABBMax = new Cartesian3_default();
function createAABBForNode(x, y, level) {
  const sizeAtLevel = 1 / Math.pow(2, level);
  const aabbMin = Cartesian3_default.fromElements(
    x * sizeAtLevel - 0.5,
    y * sizeAtLevel - 0.5,
    -0.5,
    scratchAABBMin
  );
  const aabbMax = Cartesian3_default.fromElements(
    (x + 1) * sizeAtLevel - 0.5,
    (y + 1) * sizeAtLevel - 0.5,
    0.5,
    scratchAABBMax
  );
  return AxisAlignedBoundingBox_default.fromCorners(aabbMin, aabbMax);
}
function packTriangleBuffers(trianglePositionsBuffer, triangleIndicesBuffer, trianglePositions, triangleIndex, bufferIndex) {
  Cartesian3_default.pack(
    trianglePositions[0],
    trianglePositionsBuffer,
    9 * bufferIndex
  );
  Cartesian3_default.pack(
    trianglePositions[1],
    trianglePositionsBuffer,
    9 * bufferIndex + 3
  );
  Cartesian3_default.pack(
    trianglePositions[2],
    trianglePositionsBuffer,
    9 * bufferIndex + 6
  );
  triangleIndicesBuffer[bufferIndex] = triangleIndex;
}
var scratchInterval = new Interval_default();
function getNodesIntersectingRay(currentNode, ray, intersectingNodes) {
  const interval = IntersectionTests_default.rayAxisAlignedBoundingBox(
    ray,
    currentNode.aabb,
    scratchInterval
  );
  if (!defined_default(interval)) {
    return;
  }
  const isLeaf = !currentNode.children.length || currentNode.buildingChildren;
  if (isLeaf) {
    intersectingNodes.push({
      node: currentNode,
      interval: new Interval_default(interval.start, interval.stop)
    });
    return;
  }
  for (let i = 0; i < currentNode.children.length; i++) {
    getNodesIntersectingRay(currentNode.children[i], ray, intersectingNodes);
  }
}
function findClosestPointInClosestNode(terrainPicker, intersections, ray, cullBackFaces, mode, projection) {
  const sortedIntersections = intersections.sort(function(a, b) {
    return a.interval.start - b.interval.start;
  });
  let minT = Number.MAX_VALUE;
  for (let i = 0; i < sortedIntersections.length; i++) {
    const intersection = sortedIntersections[i];
    const intersectionResult = getClosestTriangleInNode(
      terrainPicker,
      ray,
      intersection.node,
      cullBackFaces,
      mode,
      projection
    );
    minT = Math.min(intersectionResult, minT);
    if (minT !== Number.MAX_VALUE) {
      break;
    }
  }
  if (minT !== Number.MAX_VALUE) {
    return Ray_default.getPoint(ray, minT);
  }
  return void 0;
}
function getClosestTriangleInNode(terrainPicker, ray, node, cullBackFaces, mode, projection) {
  let result = Number.MAX_VALUE;
  const encoding = terrainPicker._encoding;
  const indices = terrainPicker._indices;
  const vertices = terrainPicker._vertices;
  const triangleCount = node.intersectingTriangles.length;
  const isMaxLevel = node.level >= MAXIMUM_TERRAIN_PICKER_LEVEL;
  const shouldBuildChildren = !isMaxLevel && !node.buildingChildren;
  let trianglePositions;
  let triangleIndices;
  if (shouldBuildChildren) {
    trianglePositions = new Float64Array(triangleCount * 9);
    triangleIndices = new Uint32Array(triangleCount);
  }
  for (let i = 0; i < triangleCount; i++) {
    const triIndex = node.intersectingTriangles[i];
    const v0 = getVertexPosition(
      encoding,
      mode,
      projection,
      ray,
      vertices,
      indices[3 * triIndex],
      scratchTrianglePoints[0]
    );
    const v1 = getVertexPosition(
      encoding,
      mode,
      projection,
      ray,
      vertices,
      indices[3 * triIndex + 1],
      scratchTrianglePoints[1]
    );
    const v2 = getVertexPosition(
      encoding,
      mode,
      projection,
      ray,
      vertices,
      indices[3 * triIndex + 2],
      scratchTrianglePoints[2]
    );
    const triT = IntersectionTests_default.rayTriangleParametric(
      ray,
      v0,
      v1,
      v2,
      cullBackFaces
    );
    if (defined_default(triT) && triT < result && triT >= 0) {
      result = triT;
    }
    if (shouldBuildChildren) {
      packTriangleBuffers(
        trianglePositions,
        triangleIndices,
        scratchTrianglePoints,
        triIndex,
        i
      );
    }
  }
  if (shouldBuildChildren) {
    for (let childIdx = 0; childIdx < 4; childIdx++) {
      node.addChild(childIdx);
    }
    addTrianglesToChildrenNodes(
      terrainPicker._inverseTransform,
      node,
      triangleIndices,
      trianglePositions
    );
  }
  return result;
}
var scratchCartographic = new Cartographic_default();
function getVertexPosition(encoding, mode, projection, ray, vertices, index, result) {
  let position = encoding.getExaggeratedPosition(vertices, index, result);
  if (mode === SceneMode_default.SCENE3D) {
    return position;
  }
  const ellipsoid = projection.ellipsoid;
  const positionCartographic = ellipsoid.cartesianToCartographic(
    position,
    scratchCartographic
  );
  position = projection.project(positionCartographic, result);
  position = Cartesian3_default.fromElements(
    position.z,
    position.x,
    position.y,
    result
  );
  const worldWidth = Math_default.TWO_PI * projection.ellipsoid.maximumRadius;
  const k = Math.round((ray.origin.y - position.y) / worldWidth);
  position.y += k * worldWidth;
  return position;
}
async function addTrianglesToChildrenNodes(inverseTransform, node, triangleIndices, trianglePositions) {
  node.buildingChildren = true;
  const inverseTransformPacked = new Float64Array(16);
  Matrix4_default.pack(inverseTransform, inverseTransformPacked, 0);
  const aabbArray = new Float64Array(6 * 4);
  for (let i = 0; i < 4; i++) {
    Cartesian3_default.pack(node.children[i].aabb.minimum, aabbArray, i * 6);
    Cartesian3_default.pack(node.children[i].aabb.maximum, aabbArray, i * 6 + 3);
  }
  const parameters = {
    aabbs: aabbArray,
    inverseTransform: inverseTransformPacked,
    triangleIndices,
    trianglePositions
  };
  const transferableObjects = [
    aabbArray.buffer,
    inverseTransformPacked.buffer,
    triangleIndices.buffer,
    trianglePositions.buffer
  ];
  const incrementallyBuildTerrainPickerPromise = incrementallyBuildTerrainPickerTaskProcessor.scheduleTask(
    parameters,
    transferableObjects
  );
  if (!defined_default(incrementallyBuildTerrainPickerPromise)) {
    node.buildingChildren = false;
    return;
  }
  const result = await incrementallyBuildTerrainPickerPromise;
  result.intersectingTrianglesArrays.forEach((buffer, index) => {
    if (defined_default(node.children[index])) {
      node.children[index].intersectingTriangles = new Uint32Array(buffer);
    }
  });
  node.intersectingTriangles = new Uint32Array(0);
  node.buildingChildren = false;
}
var TerrainPicker_default = TerrainPicker;

// packages/engine/Source/Core/TerrainMesh.js
function TerrainMesh(center, vertices, indices, indexCountWithoutSkirts, vertexCountWithoutSkirts, minimumHeight, maximumHeight, rectangle, boundingSphere3D, occludeePointInScaledSpace, vertexStride, orientedBoundingBox, encoding, westIndicesSouthToNorth, southIndicesEastToWest, eastIndicesNorthToSouth, northIndicesWestToEast) {
  this.center = center;
  this.vertices = vertices;
  this.stride = vertexStride ?? 6;
  this.indices = indices;
  this.indexCountWithoutSkirts = indexCountWithoutSkirts;
  this.vertexCountWithoutSkirts = vertexCountWithoutSkirts;
  this.minimumHeight = minimumHeight;
  this.maximumHeight = maximumHeight;
  this.rectangle = rectangle;
  this.boundingSphere3D = boundingSphere3D;
  this.occludeePointInScaledSpace = occludeePointInScaledSpace;
  this.orientedBoundingBox = orientedBoundingBox;
  this.encoding = encoding;
  this.westIndicesSouthToNorth = westIndicesSouthToNorth;
  this.southIndicesEastToWest = southIndicesEastToWest;
  this.eastIndicesNorthToSouth = eastIndicesNorthToSouth;
  this.northIndicesWestToEast = northIndicesWestToEast;
  this._transform = new Matrix4_default();
  this._lastPickSceneMode = void 0;
  this._terrainPicker = new TerrainPicker_default(vertices, indices, encoding);
}
TerrainMesh.prototype.getTransform = function(mode, projection) {
  if (this._lastPickSceneMode === mode) {
    return this._transform;
  }
  this._terrainPicker.needsRebuild = true;
  if (!defined_default(mode) || mode === SceneMode_default.SCENE3D) {
    return computeTransform(this, this._transform);
  }
  return computeTransform2D(this, projection, this._transform);
};
function computeTransform(mesh, result) {
  const exaggeration = mesh.encoding.exaggeration;
  const exaggerationRelativeHeight = mesh.encoding.exaggerationRelativeHeight;
  const exaggeratedMinHeight = VerticalExaggeration_default.getHeight(
    mesh.minimumHeight,
    exaggeration,
    exaggerationRelativeHeight
  );
  const exaggeratedMaxHeight = VerticalExaggeration_default.getHeight(
    mesh.maximumHeight,
    exaggeration,
    exaggerationRelativeHeight
  );
  const obb = OrientedBoundingBox_default.fromRectangle(
    mesh.rectangle,
    exaggeratedMinHeight,
    exaggeratedMaxHeight,
    Ellipsoid_default.default,
    mesh.orientedBoundingBox
  );
  OrientedBoundingBox_default.computeTransformation(obb, result);
  const zScale = Matrix4_default.getScale(result, scratchScale).z;
  if (zScale <= Math_default.EPSILON16) {
    scratchScale.z = 1;
    Matrix4_default.setScale(result, scratchScale, result);
  }
  return result;
}
var scratchSWCartesian = new Cartesian3_default();
var scratchNECartesian = new Cartesian3_default();
var scratchSWCartographic = new Cartographic_default();
var scratchNECartographic = new Cartographic_default();
var scratchScale2D = new Cartesian3_default();
var scratchCenter2D = new Cartesian3_default();
var scratchScale = new Cartesian3_default();
function computeTransform2D(mesh, projection, result) {
  const exaggeration = mesh.encoding.exaggeration;
  const exaggerationRelativeHeight = mesh.encoding.exaggerationRelativeHeight;
  const exaggeratedMinHeight = VerticalExaggeration_default.getHeight(
    mesh.minimumHeight,
    exaggeration,
    exaggerationRelativeHeight
  );
  const exaggeratedMaxHeight = VerticalExaggeration_default.getHeight(
    mesh.maximumHeight,
    exaggeration,
    exaggerationRelativeHeight
  );
  const southwest = projection.project(
    Cartographic_default.fromRadians(
      mesh.rectangle.west,
      mesh.rectangle.south,
      0,
      scratchSWCartographic
    ),
    scratchSWCartesian
  );
  const northeast = projection.project(
    Cartographic_default.fromRadians(
      mesh.rectangle.east,
      mesh.rectangle.north,
      0,
      scratchNECartographic
    ),
    scratchNECartesian
  );
  const heightRange = exaggeratedMaxHeight - exaggeratedMinHeight;
  const scale = Cartesian3_default.fromElements(
    northeast.x - southwest.x,
    northeast.y - southwest.y,
    heightRange > 0 ? heightRange : 1,
    // Avoid zero scale
    scratchScale2D
  );
  const center = Cartesian3_default.fromElements(
    southwest.x + scale.x * 0.5,
    southwest.y + scale.y * 0.5,
    exaggeratedMinHeight + scale.z * 0.5,
    scratchCenter2D
  );
  Matrix4_default.fromTranslation(center, result);
  Matrix4_default.setScale(result, scale, result);
  Matrix4_default.multiply(Transforms_default.SWIZZLE_3D_TO_2D_MATRIX, result, result);
  return result;
}
TerrainMesh.prototype.pick = function(ray, cullBackFaces, mode, projection) {
  const intersection = this._terrainPicker.rayIntersect(
    ray,
    this.getTransform(mode, projection),
    cullBackFaces,
    mode,
    projection
  );
  this._lastPickSceneMode = mode;
  return intersection;
};
TerrainMesh.prototype.updateExaggeration = function(exaggeration, exaggerationRelativeHeight) {
  this._terrainPicker._vertices = this.vertices;
  this._terrainPicker.needsRebuild = true;
  this._lastPickSceneMode = void 0;
};
TerrainMesh.prototype.updateSceneMode = function(mode) {
  this._terrainPicker.needsRebuild = true;
  this._lastPickSceneMode = void 0;
};
var TerrainMesh_default = TerrainMesh;

// packages/engine/Source/Core/Cesium3DTilesTerrainGeometryProcessor.js
var Cesium3DTilesTerrainGeometryProcessor = {};
var scratchGltfInfo = {
  positions: void 0,
  normals: void 0,
  indices: void 0,
  edgeIndicesWest: void 0,
  edgeIndicesSouth: void 0,
  edgeIndicesEast: void 0,
  edgeIndicesNorth: void 0
};
var scratchCenterCartographic = new Cartographic_default();
var scratchCenterCartesian = new Cartesian3_default();
var scratchEnuToEcef = new Matrix4_default();
var scratchEcefToEnu = new Matrix4_default();
var scratchTilesetTransform = new Matrix4_default();
var scratchMinimumPositionENU = new Cartesian3_default();
var scratchMaximumPositionENU = new Cartesian3_default();
var scratchPosLocal = new Cartesian3_default();
var scratchPosEcef = new Cartesian3_default();
var scratchCartographic2 = new Cartographic_default();
var scratchUV = new Cartesian2_default();
var scratchNormal = new Cartesian3_default();
var scratchNormalOct = new Cartesian2_default();
var scratchGeodeticSurfaceNormal = new Cartesian3_default();
var scratchPosEnu = new Cartesian3_default();
var sortedEdgeCompare = function(a, b) {
  return a - b;
};
Cesium3DTilesTerrainGeometryProcessor.createMesh = async function(options) {
  options = options ?? Frozen_default.EMPTY_OBJECT;
  const {
    exaggeration = 1,
    exaggerationRelativeHeight = 0,
    hasVertexNormals,
    hasWebMercatorT,
    gltf,
    minimumHeight,
    maximumHeight,
    skirtHeight
  } = options;
  Check_default.typeOf.object("options.ellipsoid", options.ellipsoid);
  Check_default.typeOf.object("options.rectangle", options.rectangle);
  Check_default.typeOf.bool("options.hasVertexNormals", hasVertexNormals);
  Check_default.typeOf.bool("options.hasWebMercatorT", hasWebMercatorT);
  Check_default.typeOf.object("options.gltf", gltf);
  Check_default.typeOf.number("options.minimumHeight", minimumHeight);
  Check_default.typeOf.number("options.maximumHeight", maximumHeight);
  Check_default.typeOf.object("options.boundingSphere", options.boundingSphere);
  Check_default.typeOf.object(
    "options.orientedBoundingBox",
    options.orientedBoundingBox
  );
  Check_default.typeOf.object(
    "options.horizonOcclusionPoint",
    options.horizonOcclusionPoint
  );
  Check_default.typeOf.number("options.skirtHeight", skirtHeight);
  const hasExaggeration = exaggeration !== 1;
  const hasGeodeticSurfaceNormals = hasExaggeration;
  const boundingSphere = BoundingSphere_default.clone(
    options.boundingSphere,
    new BoundingSphere_default()
  );
  const orientedBoundingBox = OrientedBoundingBox_default.clone(
    options.orientedBoundingBox,
    new OrientedBoundingBox_default()
  );
  const horizonOcclusionPoint = Cartesian3_default.clone(
    options.horizonOcclusionPoint,
    new Cartesian3_default()
  );
  const ellipsoid = Ellipsoid_default.clone(options.ellipsoid, new Ellipsoid_default());
  const rectangle = Rectangle_default.clone(options.rectangle, new Rectangle_default());
  const hasMeshOptCompression = gltf.extensionsRequired !== void 0 && gltf.extensionsRequired.indexOf("EXT_meshopt_compression") !== -1;
  const decoderPromise = hasMeshOptCompression ? MeshoptDecoder.ready : Promise.resolve(void 0);
  await decoderPromise;
  const tileMinLongitude = rectangle.west;
  const tileMinLatitude = rectangle.south;
  const tileMaxLatitude = rectangle.north;
  const tileLengthLongitude = rectangle.width;
  const tileLengthLatitude = rectangle.height;
  const approximateCenterCartographic = Rectangle_default.center(
    rectangle,
    scratchCenterCartographic
  );
  approximateCenterCartographic.height = 0.5 * (minimumHeight + maximumHeight);
  const approximateCenterPosition = Cartographic_default.toCartesian(
    approximateCenterCartographic,
    ellipsoid,
    scratchCenterCartesian
  );
  const enuToEcef = Transforms_default.eastNorthUpToFixedFrame(
    approximateCenterPosition,
    ellipsoid,
    scratchEnuToEcef
  );
  const ecefToEnu = Matrix4_default.inverseTransformation(enuToEcef, scratchEcefToEnu);
  let tilesetTransform = Matrix4_default.unpack(
    gltf.nodes[0].matrix,
    0,
    scratchTilesetTransform
  );
  tilesetTransform = Matrix4_default.multiply(
    Axis_default.Y_UP_TO_Z_UP,
    tilesetTransform,
    tilesetTransform
  );
  const gltfInfo = decodeGltf(gltf, hasVertexNormals, scratchGltfInfo);
  const skirtVertexCount = TerrainProvider_default.getSkirtVertexCount(
    gltfInfo.edgeIndicesWest,
    gltfInfo.edgeIndicesSouth,
    gltfInfo.edgeIndicesEast,
    gltfInfo.edgeIndicesNorth
  );
  const positionsLocalWithoutSkirts = gltfInfo.positions;
  const normalsWithoutSkirts = gltfInfo.normals;
  const indicesWithoutSkirts = gltfInfo.indices;
  const vertexCountWithoutSkirts = positionsLocalWithoutSkirts.length / 3;
  const vertexCountWithSkirts = vertexCountWithoutSkirts + skirtVertexCount;
  const indexCountWithoutSkirts = indicesWithoutSkirts.length;
  const skirtIndexCount = TerrainProvider_default.getSkirtIndexCountWithFilledCorners(skirtVertexCount);
  const SizedIndexTypeWithSkirts = vertexCountWithSkirts <= 65535 ? Uint16Array : Uint32Array;
  const indexBufferWithSkirts = new SizedIndexTypeWithSkirts(
    indexCountWithoutSkirts + skirtIndexCount
  );
  indexBufferWithSkirts.set(indicesWithoutSkirts);
  const westIndices = new SizedIndexTypeWithSkirts(gltfInfo.edgeIndicesWest);
  const southIndices = new SizedIndexTypeWithSkirts(gltfInfo.edgeIndicesSouth);
  const eastIndices = new SizedIndexTypeWithSkirts(gltfInfo.edgeIndicesEast);
  const northIndices = new SizedIndexTypeWithSkirts(gltfInfo.edgeIndicesNorth);
  const sortedWestIndices = new SizedIndexTypeWithSkirts(westIndices).sort();
  const sortedSouthIndices = new SizedIndexTypeWithSkirts(southIndices).sort();
  const sortedEastIndices = new SizedIndexTypeWithSkirts(eastIndices).sort();
  const sortedNorthIndices = new SizedIndexTypeWithSkirts(northIndices).sort();
  const southMercatorAngle = WebMercatorProjection_default.geodeticLatitudeToMercatorAngle(tileMinLatitude);
  const northMercatorAngle = WebMercatorProjection_default.geodeticLatitudeToMercatorAngle(tileMaxLatitude);
  const oneOverMercatorHeight = 1 / (northMercatorAngle - southMercatorAngle);
  let minPosEnu = Cartesian3_default.fromElements(
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    scratchMinimumPositionENU
  );
  let maxPosEnu = Cartesian3_default.fromElements(
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    scratchMaximumPositionENU
  );
  const tempTerrainEncoding = new TerrainEncoding_default(
    boundingSphere.center,
    void 0,
    void 0,
    void 0,
    void 0,
    hasVertexNormals,
    hasWebMercatorT,
    hasGeodeticSurfaceNormals,
    exaggeration,
    exaggerationRelativeHeight
  );
  const tempBufferStride = tempTerrainEncoding.stride;
  const tempBuffer = new Float32Array(vertexCountWithSkirts * tempBufferStride);
  let tempBufferOffset = 0;
  for (let i = 0; i < vertexCountWithoutSkirts; i++) {
    const posLocal = Cartesian3_default.unpack(
      positionsLocalWithoutSkirts,
      i * 3,
      scratchPosLocal
    );
    const posECEF = Matrix4_default.multiplyByPoint(
      tilesetTransform,
      posLocal,
      scratchPosEcef
    );
    const cartographic = Cartographic_default.fromCartesian(
      posECEF,
      ellipsoid,
      scratchCartographic2
    );
    const { longitude, latitude, height } = cartographic;
    let u = (longitude - tileMinLongitude) / tileLengthLongitude;
    let v = (latitude - tileMinLatitude) / tileLengthLatitude;
    u = Math_default.clamp(u, 0, 1);
    v = Math_default.clamp(v, 0, 1);
    if (binarySearch_default(sortedWestIndices, i, sortedEdgeCompare) >= 0) {
      u = 0;
    } else if (binarySearch_default(sortedEastIndices, i, sortedEdgeCompare) >= 0) {
      u = 1;
    }
    if (binarySearch_default(sortedSouthIndices, i, sortedEdgeCompare) >= 0) {
      v = 0;
    } else if (binarySearch_default(sortedNorthIndices, i, sortedEdgeCompare) >= 0) {
      v = 1;
    }
    const uv = Cartesian2_default.fromElements(u, v, scratchUV);
    let normalOct;
    if (hasVertexNormals) {
      let normal = Cartesian3_default.unpack(
        normalsWithoutSkirts,
        i * 3,
        scratchNormal
      );
      normal = Matrix4_default.multiplyByPointAsVector(
        tilesetTransform,
        normal,
        scratchNormal
      );
      normal = Cartesian3_default.normalize(normal, scratchNormal);
      normalOct = AttributeCompression_default.octEncode(normal, scratchNormalOct);
    }
    let webMercatorT;
    if (hasWebMercatorT) {
      const mercatorAngle = WebMercatorProjection_default.geodeticLatitudeToMercatorAngle(latitude);
      webMercatorT = (mercatorAngle - southMercatorAngle) * oneOverMercatorHeight;
    }
    let geodeticSurfaceNormal;
    if (hasGeodeticSurfaceNormals) {
      geodeticSurfaceNormal = ellipsoid.geodeticSurfaceNormal(
        posECEF,
        scratchGeodeticSurfaceNormal
      );
    }
    tempBufferOffset = tempTerrainEncoding.encode(
      tempBuffer,
      tempBufferOffset,
      posECEF,
      uv,
      height,
      normalOct,
      webMercatorT,
      geodeticSurfaceNormal
    );
    const posEnu = Matrix4_default.multiplyByPoint(ecefToEnu, posECEF, scratchPosEnu);
    minPosEnu = Cartesian3_default.minimumByComponent(posEnu, minPosEnu, minPosEnu);
    maxPosEnu = Cartesian3_default.maximumByComponent(posEnu, maxPosEnu, maxPosEnu);
  }
  const mesh = new TerrainMesh_default(
    Cartesian3_default.clone(tempTerrainEncoding.center, new Cartesian3_default()),
    tempBuffer,
    indexBufferWithSkirts,
    indexCountWithoutSkirts,
    vertexCountWithoutSkirts,
    minimumHeight,
    maximumHeight,
    rectangle,
    BoundingSphere_default.clone(boundingSphere, new BoundingSphere_default()),
    Cartesian3_default.clone(horizonOcclusionPoint, new Cartesian3_default()),
    tempBufferStride,
    OrientedBoundingBox_default.clone(orientedBoundingBox, new OrientedBoundingBox_default()),
    tempTerrainEncoding,
    westIndices,
    southIndices,
    eastIndices,
    northIndices
  );
  addSkirtsToMesh(
    mesh,
    rectangle,
    ellipsoid,
    minPosEnu,
    maxPosEnu,
    enuToEcef,
    ecefToEnu,
    skirtHeight
  );
  return Promise.resolve(mesh);
};
var scratchMinUV = new Cartesian2_default();
var scratchMaxUV = new Cartesian2_default();
var scratchPolygonIndices = new Array(6);
var scratchUvA = new Cartesian2_default();
var scratchUvB = new Cartesian2_default();
var scratchUvC = new Cartesian2_default();
var scratchNormalA = new Cartesian3_default();
var scratchNormalB = new Cartesian3_default();
var scratchNormalC = new Cartesian3_default();
var scratchCenterCartographicUpsample = new Cartographic_default();
var scratchCenterCartesianUpsample = new Cartesian3_default();
var scratchCartographicSkirt = new Cartographic_default();
var scratchCartographicUpsample = new Cartographic_default();
var scratchPosEcefSkirt = new Cartesian3_default();
var scratchPosEcefUpsample = new Cartesian3_default();
var scratchPosEnuSkirt = new Cartesian3_default();
var scratchPosEnuUpsample = new Cartesian3_default();
var scratchMinimumPositionENUSkirt = new Cartesian3_default();
var scratchMaximumPositionENUSkirt = new Cartesian3_default();
var scratchMinimumPositionENUUpsample = new Cartesian3_default();
var scratchMaximumPositionENUUpsample = new Cartesian3_default();
var scratchEnuToEcefUpsample = new Matrix4_default();
var scratchEcefToEnuUpsample = new Matrix4_default();
var scratchUVSkirt = new Cartesian2_default();
var scratchUVUpsample = new Cartesian2_default();
var scratchHorizonOcclusionPoint = new Cartesian3_default();
var scratchBoundingSphere = new BoundingSphere_default();
var scratchOrientedBoundingBox = new OrientedBoundingBox_default();
var scratchAABBEnuSkirt = new AxisAlignedBoundingBox_default();
var scratchNormalUpsample = new Cartesian3_default();
var scratchNormalOctSkirt = new Cartesian2_default();
var scratchNormalOctUpsample = new Cartesian2_default();
var scratchGeodeticSurfaceNormalSkirt = new Cartesian3_default();
var scratchGeodeticSurfaceNormalUpsample = new Cartesian3_default();
function decodePositions(gltf) {
  const primitive = gltf.meshes[0].primitives[0];
  const accessor = gltf.accessors[primitive.attributes["POSITION"]];
  const bufferView = gltf.bufferViews[accessor.bufferView];
  const positionCount = accessor.count;
  const bufferViewMeshOpt = bufferView.extensions ? bufferView.extensions["EXT_meshopt_compression"] : void 0;
  if (bufferViewMeshOpt === void 0) {
    const buffer2 = gltf.buffers[bufferView.buffer].extras._pipeline.source;
    return new Float32Array(
      buffer2.buffer,
      buffer2.byteOffset + // offset from the start of the glb
      (bufferView.byteOffset ?? 0) + (accessor.byteOffset ?? 0),
      positionCount * 3
    );
  }
  const buffer = gltf.buffers[bufferViewMeshOpt.buffer].extras._pipeline.source;
  const compressedBuffer = new Uint8Array(
    buffer.buffer,
    buffer.byteOffset + // offset from the start of the glb
    (bufferViewMeshOpt.byteOffset ?? 0) + (accessor.byteOffset ?? 0),
    bufferViewMeshOpt.byteLength
  );
  const positionByteLength = bufferViewMeshOpt.byteStride;
  const PositionType = positionByteLength === 4 ? Uint8Array : Uint16Array;
  const positionsResult = new PositionType(positionCount * 4);
  MeshoptDecoder.decodeVertexBuffer(
    new Uint8Array(positionsResult.buffer),
    positionCount,
    positionByteLength,
    compressedBuffer
  );
  const positionStorageValueMax = (1 << positionsResult.BYTES_PER_ELEMENT * 8) - 1;
  const positions = new Float32Array(positionCount * 3);
  for (let p = 0; p < positionCount; p++) {
    positions[p * 3 + 0] = positionsResult[p * 4 + 0] / positionStorageValueMax;
    positions[p * 3 + 1] = positionsResult[p * 4 + 1] / positionStorageValueMax;
    positions[p * 3 + 2] = positionsResult[p * 4 + 2] / positionStorageValueMax;
  }
  return positions;
}
function decodeNormals(gltf) {
  const primitive = gltf.meshes[0].primitives[0];
  const accessor = gltf.accessors[primitive.attributes["NORMAL"]];
  const bufferView = gltf.bufferViews[accessor.bufferView];
  const normalCount = accessor.count;
  const bufferViewMeshOpt = bufferView.extensions ? bufferView.extensions["EXT_meshopt_compression"] : void 0;
  if (bufferViewMeshOpt === void 0) {
    const buffer2 = gltf.buffers[bufferView.buffer].extras._pipeline.source;
    return new Float32Array(
      buffer2.buffer,
      buffer2.byteOffset + // offset from the start of the glb
      (bufferView.byteOffset ?? 0) + (accessor.byteOffset ?? 0),
      normalCount * 3
    );
  }
  const buffer = gltf.buffers[bufferViewMeshOpt.buffer].extras._pipeline.source;
  const compressedBuffer = new Uint8Array(
    buffer.buffer,
    buffer.byteOffset + // offset from the start of the glb
    (bufferViewMeshOpt.byteOffset ?? 0) + (accessor.byteOffset ?? 0),
    bufferViewMeshOpt.byteLength
  );
  const normalByteLength = bufferViewMeshOpt.byteStride;
  const normalsResult = new Int8Array(normalCount * normalByteLength);
  MeshoptDecoder.decodeVertexBuffer(
    new Uint8Array(normalsResult.buffer),
    normalCount,
    normalByteLength,
    compressedBuffer
  );
  const normals = new Float32Array(normalCount * 3);
  for (let i = 0; i < normalCount; i++) {
    let octX = Math.max(normalsResult[i * 4 + 0] / 127, -1);
    let octY = Math.max(normalsResult[i * 4 + 1] / 127, -1);
    const octZ = 1 - (Math.abs(octX) + Math.abs(octY));
    if (octZ < 0) {
      const oldX = octX;
      const oldY = octY;
      octX = (1 - Math.abs(oldY)) * Math_default.signNotZero(oldX);
      octY = (1 - Math.abs(oldX)) * Math_default.signNotZero(oldY);
    }
    let normal = scratchNormal;
    normal.x = octX;
    normal.y = octY;
    normal.z = octZ;
    normal = Cartesian3_default.normalize(normal, scratchNormal);
    normals[i * 3 + 0] = normal.x;
    normals[i * 3 + 1] = normal.y;
    normals[i * 3 + 2] = normal.z;
  }
  return normals;
}
function decodeIndices(gltf) {
  const primitive = gltf.meshes[0].primitives[0];
  const accessor = gltf.accessors[primitive.indices];
  const bufferView = gltf.bufferViews[accessor.bufferView];
  const indexCount = accessor.count;
  const SizedIndexType = accessor.componentType === ComponentDatatype_default.UNSIGNED_SHORT ? Uint16Array : Uint32Array;
  const bufferViewMeshOpt = bufferView.extensions ? bufferView.extensions["EXT_meshopt_compression"] : void 0;
  if (bufferViewMeshOpt === void 0) {
    const buffer2 = gltf.buffers[bufferView.buffer].extras._pipeline.source;
    return new SizedIndexType(
      buffer2.buffer,
      buffer2.byteOffset + // offset from the glb
      (bufferView.byteOffset ?? 0) + (accessor.byteOffset ?? 0),
      indexCount
    );
  }
  const buffer = gltf.buffers[bufferViewMeshOpt.buffer].extras._pipeline.source;
  const compressedBuffer = new Uint8Array(
    buffer.buffer,
    buffer.byteOffset + // offset from the start of the glb
    (bufferViewMeshOpt.byteOffset ?? 0) + (accessor.byteOffset ?? 0),
    bufferViewMeshOpt.byteLength
  );
  const indices = new SizedIndexType(indexCount);
  MeshoptDecoder.decodeIndexBuffer(
    new Uint8Array(indices.buffer),
    indexCount,
    bufferViewMeshOpt.byteStride,
    compressedBuffer
  );
  return indices;
}
function decodeEdgeIndices(gltf, name) {
  const primitive = gltf.meshes[0].primitives[0];
  const accessor = gltf.accessors[primitive.extensions.CESIUM_tile_edges[name]];
  const bufferView = gltf.bufferViews[accessor.bufferView];
  const indexCount = accessor.count;
  const SizedIndexType = accessor.componentType === ComponentDatatype_default.UNSIGNED_SHORT ? Uint16Array : Uint32Array;
  const bufferViewMeshOpt = bufferView.extensions ? bufferView.extensions["EXT_meshopt_compression"] : void 0;
  if (bufferViewMeshOpt === void 0) {
    const buffer2 = gltf.buffers[bufferView.buffer].extras._pipeline.source;
    return new SizedIndexType(
      buffer2.buffer,
      buffer2.byteOffset + // offset from the glb
      (bufferView.byteOffset ?? 0) + (accessor.byteOffset ?? 0),
      indexCount
    );
  }
  const buffer = gltf.buffers[bufferViewMeshOpt.buffer].extras._pipeline.source;
  const compressedBuffer = new Uint8Array(
    buffer.buffer,
    buffer.byteOffset + // offset from the start of the glb
    (bufferViewMeshOpt.byteOffset ?? 0) + (accessor.byteOffset ?? 0),
    bufferViewMeshOpt.byteLength
  );
  const indices = new SizedIndexType(indexCount);
  const indexByteLength = bufferViewMeshOpt.byteStride;
  MeshoptDecoder.decodeIndexSequence(
    new Uint8Array(indices.buffer),
    indexCount,
    indexByteLength,
    compressedBuffer
  );
  return indices;
}
function decodeGltf(gltf, hasNormals, result) {
  result.positions = decodePositions(gltf);
  result.normals = hasNormals ? decodeNormals(gltf) : void 0;
  result.indices = decodeIndices(gltf);
  result.edgeIndicesWest = decodeEdgeIndices(gltf, "left");
  result.edgeIndicesSouth = decodeEdgeIndices(gltf, "bottom");
  result.edgeIndicesEast = decodeEdgeIndices(gltf, "right");
  result.edgeIndicesNorth = decodeEdgeIndices(gltf, "top");
  return result;
}
Cesium3DTilesTerrainGeometryProcessor.upsampleMesh = function(options) {
  options = options ?? Frozen_default.EMPTY_OBJECT;
  const {
    isEastChild,
    isNorthChild,
    parentMinimumHeight,
    parentMaximumHeight,
    skirtHeight
  } = options;
  Check_default.typeOf.bool("options.isEastChild", isEastChild);
  Check_default.typeOf.bool("options.isNorthChild", isNorthChild);
  Check_default.typeOf.object("options.parentVertices", options.parentVertices);
  Check_default.typeOf.object("options.parentIndices", options.parentIndices);
  Check_default.typeOf.number(
    "options.parentVertexCountWithoutSkirts",
    options.parentVertexCountWithoutSkirts
  );
  Check_default.typeOf.number(
    "options.parentIndexCountWithoutSkirts",
    options.parentIndexCountWithoutSkirts
  );
  Check_default.typeOf.number("options.parentMinimumHeight", parentMinimumHeight);
  Check_default.typeOf.number("options.parentMaximumHeight", parentMaximumHeight);
  Check_default.typeOf.object("options.parentEncoding", options.parentEncoding);
  Check_default.typeOf.object("options.rectangle", options.rectangle);
  Check_default.typeOf.number("options.skirtHeight", skirtHeight);
  Check_default.typeOf.object("options.ellipsoid", options.ellipsoid);
  const indexCount = options.parentIndexCountWithoutSkirts;
  const indices = options.parentIndices;
  const vertexCount = options.parentVertexCountWithoutSkirts;
  const vertexBuffer = options.parentVertices;
  const encoding = TerrainEncoding_default.clone(
    options.parentEncoding,
    new TerrainEncoding_default()
  );
  const hasVertexNormals = encoding.hasVertexNormals;
  const hasWebMercatorT = encoding.hasWebMercatorT;
  const exaggeration = encoding.exaggeration;
  const exaggerationRelativeHeight = encoding.exaggerationRelativeHeight;
  const hasExaggeration = exaggeration !== 1;
  const hasGeodeticSurfaceNormals = hasExaggeration;
  const upsampleRectangle = Rectangle_default.clone(options.rectangle, new Rectangle_default());
  const ellipsoid = Ellipsoid_default.clone(options.ellipsoid);
  const upsampledTriIDs = [];
  const upsampledUVs = [];
  const upsampledBarys = [];
  const upsampledIndices = [];
  const upsampledWestIndices = [];
  const upsampledSouthIndices = [];
  const upsampledEastIndices = [];
  const upsampledNorthIndices = [];
  clipTileFromQuadrant(
    isEastChild,
    isNorthChild,
    indexCount,
    indices,
    vertexCount,
    vertexBuffer,
    encoding,
    upsampledIndices,
    upsampledWestIndices,
    upsampledSouthIndices,
    upsampledEastIndices,
    upsampledNorthIndices,
    upsampledTriIDs,
    upsampledBarys,
    upsampledUVs
  );
  const approximateCenterCartographic = Rectangle_default.center(
    upsampleRectangle,
    scratchCenterCartographicUpsample
  );
  approximateCenterCartographic.height = 0.5 * (parentMinimumHeight + parentMaximumHeight);
  const approximateCenterPosition = Cartographic_default.toCartesian(
    approximateCenterCartographic,
    ellipsoid,
    scratchCenterCartesianUpsample
  );
  const upsampledVertexCountWithoutSkirts = upsampledTriIDs.length;
  const upsampledTerrainEncoding = new TerrainEncoding_default(
    approximateCenterPosition,
    void 0,
    void 0,
    void 0,
    void 0,
    hasVertexNormals,
    hasWebMercatorT,
    hasGeodeticSurfaceNormals,
    exaggeration,
    exaggerationRelativeHeight
  );
  const upsampledVertexBufferStride = upsampledTerrainEncoding.stride;
  const upsampledSkirtVertexCount = TerrainProvider_default.getSkirtVertexCount(
    upsampledWestIndices,
    upsampledSouthIndices,
    upsampledEastIndices,
    upsampledNorthIndices
  );
  const upsampledVertexCountWithSkirts = upsampledVertexCountWithoutSkirts + upsampledSkirtVertexCount;
  const upsampledIndexCountWithoutSkirts = upsampledIndices.length;
  const upsampledSkirtIndexCount = TerrainProvider_default.getSkirtIndexCountWithFilledCorners(
    upsampledSkirtVertexCount
  );
  const upsampledIndexCountWithSkirts = upsampledIndexCountWithoutSkirts + upsampledSkirtIndexCount;
  const SizedIndexTypeWithSkirts = upsampledVertexCountWithSkirts <= 65535 ? Uint16Array : Uint32Array;
  const upsampledIndexBuffer = new SizedIndexTypeWithSkirts(
    upsampledIndexCountWithSkirts
  );
  upsampledIndexBuffer.set(upsampledIndices);
  const upsampledWestIndicesBuffer = new SizedIndexTypeWithSkirts(
    upsampledWestIndices
  );
  const upsampledSouthIndicesBuffer = new SizedIndexTypeWithSkirts(
    upsampledSouthIndices
  );
  const upsampledEastIndicesBuffer = new SizedIndexTypeWithSkirts(
    upsampledEastIndices
  );
  const upsampledNorthIndicesBuffer = new SizedIndexTypeWithSkirts(
    upsampledNorthIndices
  );
  const upsampledVertexBuffer = new Float32Array(
    upsampledVertexCountWithSkirts * upsampledVertexBufferStride
  );
  let upsampledVertexBufferOffset = 0;
  const enuToEcef = Transforms_default.eastNorthUpToFixedFrame(
    approximateCenterPosition,
    ellipsoid,
    scratchEnuToEcefUpsample
  );
  const ecefToEnu = Matrix4_default.inverseTransformation(
    enuToEcef,
    scratchEcefToEnuUpsample
  );
  const minimumLongitude = upsampleRectangle.west;
  const maximumLongitude = upsampleRectangle.east;
  const minimumLatitude = upsampleRectangle.south;
  const maximumLatitude = upsampleRectangle.north;
  const southMercatorAngle = WebMercatorProjection_default.geodeticLatitudeToMercatorAngle(minimumLatitude);
  const northMercatorAngle = WebMercatorProjection_default.geodeticLatitudeToMercatorAngle(maximumLatitude);
  const oneOverMercatorHeight = 1 / (northMercatorAngle - southMercatorAngle);
  let minimumHeight = Number.POSITIVE_INFINITY;
  let maximumHeight = Number.NEGATIVE_INFINITY;
  let minPosEnu = Cartesian3_default.fromElements(
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    scratchMinimumPositionENUUpsample
  );
  let maxPosEnu = Cartesian3_default.fromElements(
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    scratchMaximumPositionENUUpsample
  );
  for (let i = 0; i < upsampledVertexCountWithoutSkirts; i++) {
    const triId = upsampledTriIDs[i];
    const indexA = indices[triId * 3 + 0];
    const indexB = indices[triId * 3 + 1];
    const indexC = indices[triId * 3 + 2];
    const uv = scratchUVUpsample;
    uv.x = upsampledUVs[i * 2 + 0];
    uv.y = upsampledUVs[i * 2 + 1];
    const u = uv.x;
    const v = uv.y;
    const baryA = upsampledBarys[i * 2 + 0];
    const baryB = upsampledBarys[i * 2 + 1];
    const baryC = 1 - baryA - baryB;
    const heightA = encoding.decodeHeight(vertexBuffer, indexA);
    const heightB = encoding.decodeHeight(vertexBuffer, indexB);
    const heightC = encoding.decodeHeight(vertexBuffer, indexC);
    const height = heightA * baryA + heightB * baryB + heightC * baryC;
    minimumHeight = Math.min(height, minimumHeight);
    maximumHeight = Math.max(height, maximumHeight);
    const lon = Math_default.lerp(minimumLongitude, maximumLongitude, u);
    const lat = Math_default.lerp(minimumLatitude, maximumLatitude, v);
    const carto = Cartographic_default.fromRadians(
      lon,
      lat,
      height,
      scratchCartographicUpsample
    );
    const position = Cartographic_default.toCartesian(
      carto,
      ellipsoid,
      scratchPosEcefUpsample
    );
    const posEnu = Matrix4_default.multiplyByPoint(
      ecefToEnu,
      position,
      scratchPosEnuUpsample
    );
    minPosEnu = Cartesian3_default.minimumByComponent(posEnu, minPosEnu, minPosEnu);
    maxPosEnu = Cartesian3_default.maximumByComponent(posEnu, maxPosEnu, maxPosEnu);
    let normalOct;
    if (hasVertexNormals) {
      const normalA = encoding.decodeNormal(
        vertexBuffer,
        indexA,
        scratchNormalA
      );
      const normalB = encoding.decodeNormal(
        vertexBuffer,
        indexB,
        scratchNormalB
      );
      const normalC = encoding.decodeNormal(
        vertexBuffer,
        indexC,
        scratchNormalC
      );
      let normal = Cartesian3_default.fromElements(
        normalA.x * baryA + normalB.x * baryB + normalC.x * baryC,
        normalA.y * baryA + normalB.y * baryB + normalC.y * baryC,
        normalA.z * baryA + normalB.z * baryB + normalC.z * baryC,
        scratchNormalUpsample
      );
      normal = Cartesian3_default.normalize(normal, scratchNormalUpsample);
      normalOct = AttributeCompression_default.octEncode(
        normal,
        scratchNormalOctUpsample
      );
    }
    let webMercatorT;
    if (hasWebMercatorT) {
      const mercatorAngle = WebMercatorProjection_default.geodeticLatitudeToMercatorAngle(lat);
      webMercatorT = (mercatorAngle - southMercatorAngle) * oneOverMercatorHeight;
    }
    let geodeticSurfaceNormal;
    if (hasGeodeticSurfaceNormals) {
      geodeticSurfaceNormal = ellipsoid.geodeticSurfaceNormal(
        position,
        scratchGeodeticSurfaceNormalUpsample
      );
    }
    upsampledVertexBufferOffset = upsampledTerrainEncoding.encode(
      upsampledVertexBuffer,
      upsampledVertexBufferOffset,
      position,
      uv,
      height,
      normalOct,
      webMercatorT,
      geodeticSurfaceNormal
    );
  }
  const orientedBoundingBox = OrientedBoundingBox_default.fromRectangle(
    upsampleRectangle,
    minimumHeight,
    maximumHeight,
    ellipsoid,
    scratchOrientedBoundingBox
  );
  const boundingSphere = BoundingSphere_default.fromVertices(
    upsampledVertexBuffer,
    upsampledTerrainEncoding.center,
    upsampledVertexBufferStride,
    scratchBoundingSphere
  );
  const occluder = new EllipsoidalOccluder_default(ellipsoid);
  const horizonOcclusionPoint = occluder.computeHorizonCullingPointFromVerticesPossiblyUnderEllipsoid(
    upsampledTerrainEncoding.center,
    // vector from ellipsoid center to horizon occlusion point
    upsampledVertexBuffer,
    upsampledVertexBufferStride,
    upsampledTerrainEncoding.center,
    minimumHeight,
    scratchHorizonOcclusionPoint
  );
  const upsampledMesh = new TerrainMesh_default(
    Cartesian3_default.clone(upsampledTerrainEncoding.center, new Cartesian3_default()),
    upsampledVertexBuffer,
    upsampledIndexBuffer,
    upsampledIndexCountWithoutSkirts,
    upsampledVertexCountWithoutSkirts,
    minimumHeight,
    maximumHeight,
    upsampleRectangle,
    BoundingSphere_default.clone(boundingSphere),
    Cartesian3_default.clone(horizonOcclusionPoint),
    upsampledVertexBufferStride,
    OrientedBoundingBox_default.clone(orientedBoundingBox),
    upsampledTerrainEncoding,
    upsampledWestIndicesBuffer,
    upsampledSouthIndicesBuffer,
    upsampledEastIndicesBuffer,
    upsampledNorthIndicesBuffer
  );
  addSkirtsToMesh(
    upsampledMesh,
    upsampleRectangle,
    ellipsoid,
    minPosEnu,
    maxPosEnu,
    enuToEcef,
    ecefToEnu,
    skirtHeight
  );
  return upsampledMesh;
};
function addSkirtsToMesh(mesh, rectangle, ellipsoid, enuMinimum, enuMaximum, enuToEcef, ecefToEnu, skirtHeight) {
  const { encoding } = mesh;
  const vertexStride = encoding.stride;
  const vertexBuffer = mesh.vertices;
  const {
    hasVertexNormals,
    hasWebMercatorT,
    exaggeration,
    exaggerationRelativeHeight
  } = encoding;
  const hasExaggeration = exaggeration !== 1;
  const hasGeodeticSurfaceNormals = hasExaggeration;
  const vertexCountWithoutSkirts = mesh.vertexCountWithoutSkirts;
  let vertexBufferOffset = vertexCountWithoutSkirts * vertexStride;
  const vertexCountWithSkirts = vertexBuffer.length / vertexStride;
  const skirtVertexCount = vertexCountWithSkirts - vertexCountWithoutSkirts;
  const indices = mesh.indices;
  const indexCountWithoutSkirts = mesh.indexCountWithoutSkirts;
  const westIndices = mesh.westIndicesSouthToNorth;
  const southIndices = mesh.southIndicesEastToWest;
  const eastIndices = mesh.eastIndicesNorthToSouth;
  const northIndices = mesh.northIndicesWestToEast;
  TerrainProvider_default.addSkirtIndicesWithFilledCorners(
    westIndices,
    southIndices,
    eastIndices,
    northIndices,
    vertexCountWithoutSkirts,
    indices,
    indexCountWithoutSkirts
  );
  const westOffset = 0;
  const southOffset = westOffset + westIndices.length;
  const eastOffset = southOffset + southIndices.length;
  const northOffset = eastOffset + eastIndices.length;
  const edges = [westIndices, southIndices, eastIndices, northIndices];
  const edgeIndexOffset = [westOffset, southOffset, eastOffset, northOffset];
  const edgeLongitudeSign = [-1, 0, 1, 0];
  const edgeLatitudeSign = [0, -1, 0, 1];
  const minimumPositionENUWithSkirts = Cartesian3_default.clone(
    enuMinimum,
    scratchMinimumPositionENUSkirt
  );
  const maximumPositionENUWithSkirts = Cartesian3_default.clone(
    enuMaximum,
    scratchMaximumPositionENUSkirt
  );
  const maximumHeight = mesh.maximumHeight;
  const minimumHeightWithSkirts = mesh.minimumHeight - skirtHeight;
  for (let skirtId = 0; skirtId < skirtVertexCount; skirtId++) {
    let side = 0;
    for (side = 0; side < 3; side++) {
      if (skirtId < edgeIndexOffset[side + 1]) {
        break;
      }
    }
    const vertexIndex = edges[side][skirtId - edgeIndexOffset[side]];
    const uv = encoding.decodeTextureCoordinates(
      vertexBuffer,
      vertexIndex,
      scratchUVSkirt
    );
    const skirtLonLatOffsetPercent = 1e-4;
    const longitudeT = uv.x + edgeLongitudeSign[side] * skirtLonLatOffsetPercent;
    const latitudeT = uv.y + edgeLatitudeSign[side] * skirtLonLatOffsetPercent;
    const longitude = Math_default.lerp(
      rectangle.west,
      rectangle.east,
      longitudeT
    );
    const latitude = Math_default.clamp(
      Math_default.lerp(rectangle.south, rectangle.north, latitudeT),
      -Math_default.PI_OVER_TWO,
      +Math_default.PI_OVER_TWO
    );
    const vertHeight = encoding.decodeHeight(vertexBuffer, vertexIndex);
    const height = vertHeight - skirtHeight;
    const cartographic = Cartographic_default.fromRadians(
      longitude,
      latitude,
      height,
      scratchCartographicSkirt
    );
    const positionEcef = Cartographic_default.toCartesian(
      cartographic,
      ellipsoid,
      scratchPosEcefSkirt
    );
    let normalOct;
    if (hasVertexNormals) {
      normalOct = encoding.getOctEncodedNormal(
        vertexBuffer,
        vertexIndex,
        scratchNormalOctSkirt
      );
    }
    let webMercatorT;
    if (hasWebMercatorT) {
      webMercatorT = encoding.decodeWebMercatorT(vertexBuffer, vertexIndex);
    }
    let geodeticSurfaceNormal;
    if (hasGeodeticSurfaceNormals) {
      geodeticSurfaceNormal = ellipsoid.geodeticSurfaceNormal(
        positionEcef,
        scratchGeodeticSurfaceNormalSkirt
      );
    }
    vertexBufferOffset = encoding.encode(
      vertexBuffer,
      vertexBufferOffset,
      positionEcef,
      uv,
      height,
      normalOct,
      webMercatorT,
      geodeticSurfaceNormal
    );
    const positionENU = Matrix4_default.multiplyByPoint(
      ecefToEnu,
      positionEcef,
      scratchPosEnuSkirt
    );
    Cartesian3_default.minimumByComponent(
      positionENU,
      minimumPositionENUWithSkirts,
      minimumPositionENUWithSkirts
    );
    Cartesian3_default.maximumByComponent(
      positionENU,
      maximumPositionENUWithSkirts,
      maximumPositionENUWithSkirts
    );
  }
  const aabbEnuWithSkirts = AxisAlignedBoundingBox_default.fromCorners(
    minimumPositionENUWithSkirts,
    maximumPositionENUWithSkirts,
    scratchAABBEnuSkirt
  );
  const encodingWithSkirts = new TerrainEncoding_default(
    encoding.center,
    aabbEnuWithSkirts,
    minimumHeightWithSkirts,
    maximumHeight,
    enuToEcef,
    encoding.hasVertexNormals,
    encoding.hasWebMercatorT,
    hasGeodeticSurfaceNormals,
    exaggeration,
    exaggerationRelativeHeight
  );
  if (encoding.quantization !== encodingWithSkirts.quantization) {
    const finalEncoding = encodingWithSkirts;
    const finalVertexStride = finalEncoding.stride;
    const finalVertexBuffer = new Float32Array(
      vertexCountWithSkirts * finalVertexStride
    );
    let finalVertexBufferOffset = 0;
    for (let i = 0; i < vertexCountWithSkirts; i++) {
      finalVertexBufferOffset = finalEncoding.encode(
        finalVertexBuffer,
        finalVertexBufferOffset,
        encoding.decodePosition(vertexBuffer, i, scratchPosEcefSkirt),
        encoding.decodeTextureCoordinates(vertexBuffer, i, scratchUVSkirt),
        encoding.decodeHeight(vertexBuffer, i),
        encoding.hasVertexNormals ? encoding.getOctEncodedNormal(vertexBuffer, i, scratchNormalOctSkirt) : void 0,
        encoding.hasWebMercatorT ? encoding.decodeWebMercatorT(vertexBuffer, i) : void 0,
        encoding.hasGeodeticSurfaceNormals ? encoding.decodeGeodeticSurfaceNormal(
          vertexBuffer,
          i,
          scratchGeodeticSurfaceNormalSkirt
        ) : void 0
      );
    }
    mesh.vertices = finalVertexBuffer;
    mesh.stride = finalVertexStride;
    mesh.encoding = finalEncoding;
  }
  return mesh;
}
var EDGE_ID_LEFT = 0;
var EDGE_ID_TOP = 1;
var EDGE_ID_RIGHT = 2;
var EDGE_ID_BOTTOM = 3;
var EDGE_COUNT = 4;
var scratchIntersection = new Cartesian3_default();
var scratchInBarys = [
  new Cartesian3_default(),
  new Cartesian3_default(),
  new Cartesian3_default(),
  new Cartesian3_default(),
  new Cartesian3_default(),
  new Cartesian3_default()
];
var scratchInPoints = [
  new Cartesian2_default(),
  new Cartesian2_default(),
  new Cartesian2_default(),
  new Cartesian2_default(),
  new Cartesian2_default(),
  new Cartesian2_default()
];
var scratchOutBarys = [
  new Cartesian3_default(),
  new Cartesian3_default(),
  new Cartesian3_default(),
  new Cartesian3_default(),
  new Cartesian3_default(),
  new Cartesian3_default()
];
var scratchOutPoints = [
  new Cartesian2_default(),
  new Cartesian2_default(),
  new Cartesian2_default(),
  new Cartesian2_default(),
  new Cartesian2_default(),
  new Cartesian2_default()
];
function inside(boxMinimum, boxMaximum, edgeId, p) {
  switch (edgeId) {
    case EDGE_ID_LEFT:
      return Math_default.sign(p.x - boxMinimum.x);
    case EDGE_ID_RIGHT:
      return Math_default.sign(boxMaximum.x - p.x);
    case EDGE_ID_BOTTOM:
      return Math_default.sign(p.y - boxMinimum.y);
    default:
      return Math_default.sign(boxMaximum.y - p.y);
  }
}
function intersect(boxMinimum, boxMaximum, edgeId, a, b, result) {
  let t, intersectX, intersectY;
  switch (edgeId) {
    case EDGE_ID_LEFT:
      t = (boxMinimum.x - a.x) / (b.x - a.x);
      intersectX = boxMinimum.x;
      intersectY = a.y + (b.y - a.y) * t;
      break;
    case EDGE_ID_RIGHT:
      t = (boxMaximum.x - a.x) / (b.x - a.x);
      intersectX = boxMaximum.x;
      intersectY = a.y + (b.y - a.y) * t;
      break;
    case EDGE_ID_BOTTOM:
      t = (boxMinimum.y - a.y) / (b.y - a.y);
      intersectX = a.x + (b.x - a.x) * t;
      intersectY = boxMinimum.y;
      break;
    default:
      t = (boxMaximum.y - a.y) / (b.y - a.y);
      intersectX = a.x + (b.x - a.x) * t;
      intersectY = boxMaximum.y;
      break;
  }
  return Cartesian3_default.fromElements(intersectX, intersectY, t, result);
}
var scratchPolygon = {
  length: 0,
  coordinates: [
    new Cartesian2_default(),
    new Cartesian2_default(),
    new Cartesian2_default(),
    new Cartesian2_default(),
    new Cartesian2_default(),
    new Cartesian2_default()
  ],
  barycentricCoordinates: [
    new Cartesian3_default(),
    new Cartesian3_default(),
    new Cartesian3_default(),
    new Cartesian3_default(),
    new Cartesian3_default(),
    new Cartesian3_default()
  ]
};
function clipTriangleAgainstBoxEdgeRange(edgeStart, edgeCount, boxMinimum, boxMaximum, p0, p1, p2, result) {
  let inputLength = 0;
  let inputPoints = scratchInPoints;
  let inputBarys = scratchInBarys;
  let outputLength = 3;
  let outputPoints = scratchOutPoints;
  Cartesian2_default.clone(p0, outputPoints[0]);
  Cartesian2_default.clone(p1, outputPoints[1]);
  Cartesian2_default.clone(p2, outputPoints[2]);
  let outputBarys = scratchOutBarys;
  Cartesian3_default.fromElements(1, 0, 0, outputBarys[0]);
  Cartesian3_default.fromElements(0, 1, 0, outputBarys[1]);
  Cartesian3_default.fromElements(0, 0, 1, outputBarys[2]);
  for (let e = 0; e < edgeCount; e++) {
    const edgeId = (edgeStart + e) % EDGE_COUNT;
    const tempPoints = inputPoints;
    const tempBarys = inputBarys;
    inputPoints = outputPoints;
    inputBarys = outputBarys;
    inputLength = outputLength;
    outputPoints = tempPoints;
    outputBarys = tempBarys;
    outputLength = 0;
    let prevIdx = inputLength - 1;
    let prevPoint = inputPoints[prevIdx];
    let prevBary = inputBarys[prevIdx];
    let prevInside = inside(boxMinimum, boxMaximum, edgeId, prevPoint);
    for (let currIdx = 0; currIdx < inputLength; currIdx++) {
      const currPoint = inputPoints[currIdx];
      const currBary = inputBarys[currIdx];
      const currInside = inside(boxMinimum, boxMaximum, edgeId, currPoint);
      if (prevInside * currInside === -1) {
        const intersection = intersect(
          boxMinimum,
          boxMaximum,
          edgeId,
          prevPoint,
          currPoint,
          scratchIntersection
        );
        const { x, y, z: t } = intersection;
        const tInv = 1 - t;
        const baryA = prevBary.x * tInv + currBary.x * t;
        const baryB = prevBary.y * tInv + currBary.y * t;
        const baryC = prevBary.z * tInv + currBary.z * t;
        Cartesian2_default.fromElements(x, y, outputPoints[outputLength]);
        Cartesian3_default.fromElements(baryA, baryB, baryC, outputBarys[outputLength]);
        outputLength++;
      }
      if (currInside >= 0) {
        Cartesian2_default.clone(currPoint, outputPoints[outputLength]);
        Cartesian3_default.clone(currBary, outputBarys[outputLength]);
        outputLength++;
      }
      prevIdx = currIdx;
      prevPoint = currPoint;
      prevBary = currBary;
      prevInside = currInside;
    }
    if (outputLength === 0) {
      break;
    }
  }
  result.length = outputLength;
  for (let i = 0; i < outputLength; i++) {
    Cartesian2_default.clone(outputPoints[i], result.coordinates[i]);
    Cartesian3_default.clone(outputBarys[i], result.barycentricCoordinates[i]);
  }
  return result;
}
function clipTriangleFromQuadrant(isEastChild, isNorthChild, boxMinimum, boxMaximum, p0, p1, p2, result) {
  const edgeStart = isEastChild ? isNorthChild ? EDGE_ID_BOTTOM : EDGE_ID_LEFT : isNorthChild ? EDGE_ID_RIGHT : EDGE_ID_TOP;
  return clipTriangleAgainstBoxEdgeRange(
    edgeStart,
    2,
    boxMinimum,
    boxMaximum,
    p0,
    p1,
    p2,
    result
  );
}
var lookUpTableBaryToPrim = [
  [],
  // 000
  [0],
  // 001
  [1],
  // 010
  [0, 1],
  // 011
  [2],
  // 100
  [0, 2],
  // 101
  [1, 2],
  // 110
  [0, 1, 2]
  // 111
];
function clipTileFromQuadrant(isEastChild, isNorthChild, indexCount, indices, vertexCount, vertices, vertexEncoding, resultIndices, resultWestIndices, resultSouthIndices, resultEastIndices, resultNorthIndices, resultTriIds, resultBary, resultUVs) {
  const upsampledVertexMap = {};
  const minU = isEastChild ? 0.5 : 0;
  const maxU = isEastChild ? 1 : 0.5;
  const minV = isNorthChild ? 0.5 : 0;
  const maxV = isNorthChild ? 1 : 0.5;
  const minUV = scratchMinUV;
  minUV.x = minU;
  minUV.y = minV;
  const maxUV = scratchMaxUV;
  maxUV.x = maxU;
  maxUV.y = maxV;
  let upsampledVertexCount = 0;
  for (let i = 0; i < indexCount; i += 3) {
    const indexA = indices[i + 0];
    const indexB = indices[i + 1];
    const indexC = indices[i + 2];
    const uvA = vertexEncoding.decodeTextureCoordinates(
      vertices,
      indexA,
      scratchUvA
    );
    const uvB = vertexEncoding.decodeTextureCoordinates(
      vertices,
      indexB,
      scratchUvB
    );
    const uvC = vertexEncoding.decodeTextureCoordinates(
      vertices,
      indexC,
      scratchUvC
    );
    const clippedPolygon = clipTriangleFromQuadrant(
      isEastChild,
      isNorthChild,
      minUV,
      maxUV,
      uvA,
      uvB,
      uvC,
      scratchPolygon
    );
    const clippedPolygonLength = clippedPolygon.length;
    if (clippedPolygonLength < 3) {
      continue;
    }
    const polygonUpsampledIndices = scratchPolygonIndices;
    for (let p = 0; p < clippedPolygonLength; p++) {
      const polygonBary = clippedPolygon.barycentricCoordinates[p];
      const bA = polygonBary.x;
      const bB = polygonBary.y;
      const bC = polygonBary.z;
      const baryId = Math.ceil(bA) | Math.ceil(bB) << 1 | Math.ceil(bC) << 2;
      const primitiveIds = lookUpTableBaryToPrim[baryId];
      let upsampledIndex;
      let isNewVertex = false;
      if (primitiveIds.length === 1) {
        const pointPrimitiveId = primitiveIds[0];
        const pointIndex = indices[i + pointPrimitiveId];
        const pointKey = pointIndex;
        upsampledIndex = upsampledVertexMap[pointKey];
        if (upsampledIndex === void 0) {
          isNewVertex = true;
          upsampledIndex = upsampledVertexCount++;
          upsampledVertexMap[pointKey] = upsampledIndex;
        }
      } else if (primitiveIds.length === 2) {
        const edgePrimitiveIdA = primitiveIds[0];
        const edgePrimitiveIdB = primitiveIds[1];
        const edgeIndexA = indices[i + edgePrimitiveIdA];
        const edgeIndexB = indices[i + edgePrimitiveIdB];
        const prevBary = clippedPolygon.barycentricCoordinates[(p + clippedPolygonLength - 1) % clippedPolygonLength];
        const prevBaryId = Math.ceil(prevBary.x) | Math.ceil(prevBary.y) << 1 | Math.ceil(prevBary.z) << 2;
        const sameEdge = baryId === prevBaryId;
        const minIndex = Math.min(edgeIndexA, edgeIndexB);
        const maxIndex = Math.max(edgeIndexA, edgeIndexB);
        const baseKey = vertexCount + 2 * (minIndex * vertexCount + maxIndex);
        const firstKey = baseKey + 0;
        const secondKey = baseKey + 1;
        const firstEntry = upsampledVertexMap[firstKey];
        const secondEntry = upsampledVertexMap[secondKey];
        const useFirst = !sameEdge === (firstEntry === void 0 || secondEntry === void 0);
        upsampledIndex = useFirst ? firstEntry : secondEntry;
        if (upsampledIndex === void 0) {
          isNewVertex = true;
          upsampledIndex = upsampledVertexCount++;
          const edgeKey = useFirst ? firstKey : secondKey;
          upsampledVertexMap[edgeKey] = upsampledIndex;
        }
      } else {
        isNewVertex = true;
        upsampledIndex = upsampledVertexCount++;
      }
      polygonUpsampledIndices[p] = upsampledIndex;
      if (isNewVertex) {
        const triId = i / 3;
        resultTriIds.push(triId);
        const polygonUV = clippedPolygon.coordinates[p];
        const u = (polygonUV.x - minU) / (maxU - minU);
        const v = (polygonUV.y - minV) / (maxV - minV);
        resultUVs.push(u, v);
        resultBary.push(bA, bB);
        if (u === 0) {
          resultWestIndices.push(upsampledIndex);
        } else if (u === 1) {
          resultEastIndices.push(upsampledIndex);
        }
        if (v === 0) {
          resultSouthIndices.push(upsampledIndex);
        } else if (v === 1) {
          resultNorthIndices.push(upsampledIndex);
        }
      }
    }
    const ui0 = polygonUpsampledIndices[0];
    let ui1 = polygonUpsampledIndices[1];
    let ui2 = polygonUpsampledIndices[2];
    resultIndices.push(ui0, ui1, ui2);
    for (let j = 3; j < clippedPolygonLength; j++) {
      ui1 = ui2;
      ui2 = polygonUpsampledIndices[j];
      resultIndices.push(ui0, ui1, ui2);
    }
  }
  resultWestIndices.sort(function(a, b) {
    return resultUVs[a * 2 + 1] - resultUVs[b * 2 + 1];
  });
  resultSouthIndices.sort(function(a, b) {
    return resultUVs[b * 2 + 0] - resultUVs[a * 2 + 0];
  });
  resultEastIndices.sort(function(a, b) {
    return resultUVs[b * 2 + 1] - resultUVs[a * 2 + 1];
  });
  resultNorthIndices.sort(function(a, b) {
    return resultUVs[a * 2 + 0] - resultUVs[b * 2 + 0];
  });
}
var Cesium3DTilesTerrainGeometryProcessor_default = Cesium3DTilesTerrainGeometryProcessor;

export {
  Cesium3DTilesTerrainGeometryProcessor_default
};
