<template>
    <div class="landing-page">
        <header class="header-nav">
            <a href="#">中古車</a>
            <a href="#">輸入車</a>
            <a href="#">中古車販売店</a>
        </header>

        <main>
            <section class="hero">
                <h1>選択した車体の中古車検索地域選択ページ　タイトル</h1>
                <p>サイトの内容や情報を伝え、続きへ誘導したくさせるサブ説明文...</p>
                <div class="hero-image" :style="{ backgroundImage: 'url(/hero-bg.jpg)' }"></div>
            </section>

            <section class="search-section">

                <section>
					<h2 class="title1">CTの中古車検索・地域選択</h2>
										<section>
						<form name="BUFORM" id="BUFORM" action="/usedcar/index.html" method="get">
							<input type="hidden" name="STID" id="STID" value="CS210610">
							<input type="hidden" name="AR" id="AR" value="">
							<input type="hidden" name="BRDC" id="BRDC" value="">
							<input type="hidden" name="CARC" id="CARC" value="LE_S012">
							<input type="hidden" name="NINTEI" id="NINTEI" value="">
							<input type="hidden" name="CSHOSHO" id="CSHOSHO" value="">
							<input type="hidden" name="HISTAR" id="HISTAR" value="">
							<div class="selectArea">
								<div class="selectArea__title">
									<div class="selectArea__title__heading">
										<h3 class="title5">レクサス&nbsp;&nbsp;<a href="/usedcar/bLE/s012/index.html">CTの中古車</a>を探す地域を選択してください</h3><span class="subText">（複数選択可）（）内＝中古車物件数</span>
									</div>
									<p>現在の検索条件：<b>レクサス、CT</b></p>
								</div>
								<!-- 全国 -->
								<table class="areaTable js-tableRoot">
									<tbody><tr>
										<th>
											<input type="checkbox" data-count="454" id="l0" value="0" class="js_areaChk">
											<label for="l0" class="label--checkbox"><a href="/usedcar/bLE/s012/index.html">全国<span class="areaNum">(454)</span></a></label>
										</th>
										<td></td>
									</tr>
									<!-- 関東 -->
									<tr class="row2">
										<th rowspan="2">
																						<input type="checkbox" data-count="125" id="l1" value="1" class="js_areaChk">
											<label for="l1" class="label--checkbox"><a href="/usedcar/bLE/s012/a1/index.html">関東<span class="areaNum">(125)</span></a></label>
																					</th>
										<td>
											<div class="tdBox">
												  												<input type="checkbox" data-count="7" id="l1_35" value="35" class="js_areaChk">
												<label for="l1_35" class="label--checkbox"><a href="/usedcar/bLE/s012/a35/index.html">東京都<span class="areaNum">(7)</span></a></label>
												           												<input type="checkbox" data-count="34" id="l1_33" value="33" class="js_areaChk">
												<label for="l1_33" class="label--checkbox"><a href="/usedcar/bLE/s012/a33/index.html">埼玉県<span class="areaNum">(34)</span></a></label>
												     												<input type="checkbox" data-count="14" id="l1_36" value="36" class="js_areaChk">
												<label for="l1_36" class="label--checkbox"><a href="/usedcar/bLE/s012/a36/index.html">神奈川県<span class="areaNum">(14)</span></a></label>
												     												<input type="checkbox" data-count="40" id="l1_34" value="34" class="js_areaChk">
												<label for="l1_34" class="label--checkbox"><a href="/usedcar/bLE/s012/a34/index.html">千葉県<span class="areaNum">(40)</span></a></label>
												     												<input type="checkbox" data-count="17" id="l1_30" value="30" class="js_areaChk">
												<label for="l1_30" class="label--checkbox"><a href="/usedcar/bLE/s012/a30/index.html">茨城県<span class="areaNum">(17)</span></a></label>
												  											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div class="tdBox">
												   												<input type="checkbox" data-count="9" id="l1_32" value="32" class="js_areaChk">
												<label for="l1_32" class="label--checkbox"><a href="/usedcar/bLE/s012/a32/index.html">群馬県<span class="areaNum">(9)</span></a></label>
												     												<input type="checkbox" data-count="4" id="l1_31" value="31" class="js_areaChk">
												<label for="l1_31" class="label--checkbox"><a href="/usedcar/bLE/s012/a31/index.html">栃木県<span class="areaNum">(4)</span></a></label>
												   											</div>
										</td>
									</tr>
									<!-- 関西 -->
									<tr class="row2">
										<th rowspan="2">
																						<input type="checkbox" data-count="78" id="l2" value="2" class="js_areaChk">
											<label for="l2" class="label--checkbox"><a href="/usedcar/bLE/s012/a2/index.html">関西<span class="areaNum">(78)</span></a></label>
																					</th>
										<td>
											<div class="tdBox">
																																																	<input type="checkbox" data-count="33" id="l2_53" value="53" class="js_areaChk">
													<label for="l2_53" class="label--checkbox"><a href="/usedcar/bLE/s012/a53/index.html">大阪府<span class="areaNum">(33)</span></a></label>
																																																																																																																																																																																																																																												<input type="checkbox" data-count="12" id="l2_54" value="54" class="js_areaChk">
													<label for="l2_54" class="label--checkbox"><a href="/usedcar/bLE/s012/a54/index.html">兵庫県<span class="areaNum">(12)</span></a></label>
																																																																																																																																																																																																							<input type="checkbox" data-count="11" id="l2_52" value="52" class="js_areaChk">
													<label for="l2_52" class="label--checkbox"><a href="/usedcar/bLE/s012/a52/index.html">京都府<span class="areaNum">(11)</span></a></label>
																																																																																								<input type="checkbox" data-count="8" id="l2_51" value="51" class="js_areaChk">
													<label for="l2_51" class="label--checkbox"><a href="/usedcar/bLE/s012/a51/index.html">滋賀県<span class="areaNum">(8)</span></a></label>
																																																																																								<input type="checkbox" data-count="3" id="l2_55" value="55" class="js_areaChk">
													<label for="l2_55" class="label--checkbox"><a href="/usedcar/bLE/s012/a55/index.html">奈良県<span class="areaNum">(3)</span></a></label>
																																																		</div>
										</td>
									</tr>
									<tr>
										<td>
											<div class="tdBox">
																																																													<input type="checkbox" data-count="11" id="l2_56" value="56" class="js_areaChk">
													<label for="l2_56" class="label--checkbox"><a href="/usedcar/bLE/s012/a56/index.html">和歌山県<span class="areaNum">(11)</span></a></label>
																																																														</div>
										</td>
									</tr>
									<!-- 東海 -->
									<tr>
										<th>
																						<input type="checkbox" data-count="76" id="l3" value="3" class="js_areaChk">
											<label for="l3" class="label--checkbox"><a href="/usedcar/bLE/s012/a3/index.html">東海<span class="areaNum">(76)</span></a></label>
																					</th>
										<td>
											<div class="tdBox">
																																																	<input type="checkbox" data-count="48" id="l3_48" value="48" class="js_areaChk">
													<label for="l3_48" class="label--checkbox"><a href="/usedcar/bLE/s012/a48/index.html">愛知県<span class="areaNum">(48)</span></a></label>
																																																																																																																																																							<input type="checkbox" data-count="11" id="l3_46" value="46" class="js_areaChk">
													<label for="l3_46" class="label--checkbox"><a href="/usedcar/bLE/s012/a46/index.html">岐阜県<span class="areaNum">(11)</span></a></label>
																																																																												<input type="checkbox" data-count="6" id="l3_50" value="50" class="js_areaChk">
													<label for="l3_50" class="label--checkbox"><a href="/usedcar/bLE/s012/a50/index.html">三重県<span class="areaNum">(6)</span></a></label>
																																																																												<input type="checkbox" data-count="11" id="l3_47" value="47" class="js_areaChk">
													<label for="l3_47" class="label--checkbox"><a href="/usedcar/bLE/s012/a47/index.html">静岡県<span class="areaNum">(11)</span></a></label>
																																																																																																																													</div>
										</td>
									</tr>
									<!-- 北海道 -->
									<tr class="row2">
										<th rowspan="2">
																						<input type="checkbox" data-count="6" id="l4" value="4" class="js_areaChk">
											<label for="l4" class="label--checkbox"><a href="/usedcar/bLE/s012/a4/index.html">北海道<span class="areaNum">(6)</span></a></label>
																					</th>
										<td>
											<div class="tdBox">
																																				<input type="checkbox" id="l4_01_5600" disabled="">
												<label for="l4_01_5600" class="label--checkbox">札幌市内<span class="areaNum">(0)</span>
												</label>
																																																												<input type="checkbox" data-count="4" id="l4_01_5670" value="5670" class="js_areaChk">
												<label for="l4_01_5670" class="label--checkbox"><a href="/usedcar/bLE/s012/a5670/index.html">函館・道南<span class="areaNum">(4)</span></a></label>
																																																												<input type="checkbox" data-count="2" id="l4_01_5620" value="5620" class="js_areaChk">
												<label for="l4_01_5620" class="label--checkbox"><a href="/usedcar/bLE/s012/a5620/index.html">札幌近郊<span class="areaNum">(2)</span></a></label>
																																																												<input type="checkbox" id="l4_01_5660" disabled="">
												<label for="l4_01_5660" class="label--checkbox">帯広・十勝<span class="areaNum">(0)</span>
												</label>
																																																												<input type="checkbox" id="l4_01_5630" disabled="">
												<label for="l4_01_5630" class="label--checkbox">岩見沢・滝川<span class="areaNum">(0)</span>
												</label>
																																			</div>
										</td>
									</tr>
									<tr>
										<td>
											<div class="tdBox">
																																																<input type="checkbox" id="l4_01_5661" disabled="">
												<label for="l4_01_5661" class="label--checkbox">釧路・根室<span class="areaNum">(0)</span>
												</label>
																																																												<input type="checkbox" id="l4_01_5640" disabled="">
												<label for="l4_01_5640" class="label--checkbox">旭川・道北<span class="areaNum">(0)</span>
												</label>
																																																												<input type="checkbox" id="l4_01_5662" disabled="">
												<label for="l4_01_5662" class="label--checkbox">北見・網走<span class="areaNum">(0)</span>
												</label>
																																																												<input type="checkbox" id="l4_01_5650" disabled="">
												<label for="l4_01_5650" class="label--checkbox">苫小牧・室蘭<span class="areaNum">(0)</span>
												</label>
																																															</div>
										</td>
									</tr>
									<!-- 東北 -->
									<tr class="row2">
										<th rowspan="2">
																						<input type="checkbox" data-count="31" id="l6" value="6" class="js_areaChk">
											<label for="l6" class="label--checkbox"><a href="/usedcar/bLE/s012/a6/index.html">東北<span class="areaNum">(31)</span></a></label>
																					</th>
										<td>
											<div class="tdBox">
																																				<input type="checkbox" id="l6_20" value="20" disabled="">
												<label for="l6_20" class="label--checkbox">青森県<span class="areaNum">(0)</span>
												</label>
																																																												<input type="checkbox" data-count="3" id="l6_21" value="21" class="js_areaChk">
												<label for="l6_21" class="label--checkbox"><a href="/usedcar/bLE/s012/a21/index.html">岩手県<span class="areaNum">(3)</span></a></label>
																																																												<input type="checkbox" data-count="14" id="l6_22" value="22" class="js_areaChk">
												<label for="l6_22" class="label--checkbox"><a href="/usedcar/bLE/s012/a22/index.html">宮城県<span class="areaNum">(14)</span></a></label>
																																																												<input type="checkbox" data-count="2" id="l6_23" value="23" class="js_areaChk">
												<label for="l6_23" class="label--checkbox"><a href="/usedcar/bLE/s012/a23/index.html">秋田県<span class="areaNum">(2)</span></a></label>
																																																												<input type="checkbox" data-count="7" id="l6_24" value="24" class="js_areaChk">
												<label for="l6_24" class="label--checkbox"><a href="/usedcar/bLE/s012/a24/index.html">山形県<span class="areaNum">(7)</span></a></label>
																																			</div>
										</td>
									</tr>
									<tr>
										<td>
											<div class="tdBox">
																																																<input type="checkbox" data-count="5" id="l6_25" value="25" class="js_areaChk">
												<label for="l6_25" class="label--checkbox"><a href="/usedcar/bLE/s012/a25/index.html">福島県<span class="areaNum">(5)</span></a></label>
																																															</div>
										</td>
									</tr>
									<!-- 北陸・甲信越 -->
									<tr class="row2">
										<th rowspan="2">
																						<input type="checkbox" data-count="15" id="l7" value="7" class="js_areaChk">
											<label for="l7" class="label--checkbox"><a href="/usedcar/bLE/s012/a7/index.html">北陸・甲信越<span class="areaNum">(15)</span></a></label>
																					</th>
										<td>
											<div class="tdBox">
																																				<input type="checkbox" data-count="2" id="l7_40" value="40" class="js_areaChk">
												<label for="l7_40" class="label--checkbox"><a href="/usedcar/bLE/s012/a40/index.html">新潟県<span class="areaNum">(2)</span></a></label>
																																																												<input type="checkbox" data-count="2" id="l7_41" value="41" class="js_areaChk">
												<label for="l7_41" class="label--checkbox"><a href="/usedcar/bLE/s012/a41/index.html">富山県<span class="areaNum">(2)</span></a></label>
																																																												<input type="checkbox" data-count="5" id="l7_42" value="42" class="js_areaChk">
												<label for="l7_42" class="label--checkbox"><a href="/usedcar/bLE/s012/a42/index.html">石川県<span class="areaNum">(5)</span></a></label>
																																																												<input type="checkbox" id="l7_43" disabled="">
												<label for="l7_43" class="label--checkbox">福井県<span class="areaNum">(0)</span>
												</label>
																																																												<input type="checkbox" id="l7_44" disabled="">
												<label for="l7_44" class="label--checkbox">山梨県<span class="areaNum">(0)</span>
												</label>
																																			</div>
										</td>
									</tr>
									<tr>
										<td>
											<div class="tdBox">
																																																<input type="checkbox" data-count="6" id="l7_45" value="45" class="js_areaChk">
												<label for="l7_45" class="label--checkbox"><a href="/usedcar/bLE/s012/a45/index.html">長野県<span class="areaNum">(6)</span></a></label>
																																															</div>
										</td>
									</tr>
									<!-- 中国 -->
									<tr>
										<th>
																						<input type="checkbox" data-count="33" id="l8" value="8" class="js_areaChk">
											<label for="l8" class="label--checkbox"><a href="/usedcar/bLE/s012/a8/index.html">中国<span class="areaNum">(33)</span></a></label>
																					</th>
										<td>
											<div class="tdBox">
																																				<input type="checkbox" data-count="2" id="l8_60" value="60" class="js_areaChk">
												<label for="l8_60" class="label--checkbox"><a href="/usedcar/bLE/s012/a60/index.html">鳥取県<span class="areaNum">(2)</span></a></label>
																																																<input type="checkbox" id="l8_61" value="61" disabled="">
												<label for="l8_61" class="label--checkbox">島根県<span class="areaNum">(0)</span>
												</label>
																																																<input type="checkbox" data-count="17" id="l8_62" value="62" class="js_areaChk">
												<label for="l8_62" class="label--checkbox"><a href="/usedcar/bLE/s012/a62/index.html">岡山県<span class="areaNum">(17)</span></a></label>
																																																<input type="checkbox" data-count="6" id="l8_63" value="63" class="js_areaChk">
												<label for="l8_63" class="label--checkbox"><a href="/usedcar/bLE/s012/a63/index.html">広島県<span class="areaNum">(6)</span></a></label>
																																																<input type="checkbox" data-count="8" id="l8_64" value="64" class="js_areaChk">
												<label for="l8_64" class="label--checkbox"><a href="/usedcar/bLE/s012/a64/index.html">山口県<span class="areaNum">(8)</span></a></label>
																																			</div>
										</td>
									</tr>
									<!-- 四国 -->
									<tr>
										<th>
																						<input type="checkbox" data-count="10" id="l9" value="9" class="js_areaChk">
											<label for="l9" class="label--checkbox"><a href="/usedcar/bLE/s012/a9/index.html">四国<span class="areaNum">(10)</span></a></label>
																					</th>
										<td>
											<div class="tdBox">
																																				<input type="checkbox" data-count="3" id="l9_70" value="70" class="js_areaChk">
												<label for="l9_70" class="label--checkbox"><a href="/usedcar/bLE/s012/a70/index.html">徳島県<span class="areaNum">(3)</span></a></label>
																																																<input type="checkbox" data-count="4" id="l9_71" value="71" class="js_areaChk">
												<label for="l9_71" class="label--checkbox"><a href="/usedcar/bLE/s012/a71/index.html">香川県<span class="areaNum">(4)</span></a></label>
																																																<input type="checkbox" data-count="3" id="l9_72" value="72" class="js_areaChk">
												<label for="l9_72" class="label--checkbox"><a href="/usedcar/bLE/s012/a72/index.html">愛媛県<span class="areaNum">(3)</span></a></label>
																																																<input type="checkbox" id="l9_73" value="73" disabled="">
												<label for="l9_73" class="label--checkbox">高知県<span class="areaNum">(0)</span>
												</label>
																																			</div>
										</td>
									</tr>
									<!-- 九州・沖縄 -->
									<tr class="row2">
										<th rowspan="2">
																						<input type="checkbox" data-count="80" id="l5" value="5" class="js_areaChk">
											<label for="l5" class="label--checkbox"><a href="/usedcar/bLE/s012/a5/index.html">九州・沖縄<span class="areaNum">(80)</span></a></label>
																					</th>
										<td>
											<div class="tdBox">
																																																<input type="checkbox" data-count="29" id="l5_80" value="80" class="js_areaChk">
												<label for="l5_80" class="label--checkbox"><a href="/usedcar/bLE/s012/a80/index.html">福岡県<span class="areaNum">(29)</span></a></label>
																																																																																																																																																																																																																																				<input type="checkbox" data-count="3" id="l5_81" value="81" class="js_areaChk">
												<label for="l5_81" class="label--checkbox"><a href="/usedcar/bLE/s012/a81/index.html">佐賀県<span class="areaNum">(3)</span></a></label>
																																																																																				<input type="checkbox" data-count="22" id="l5_83" value="83" class="js_areaChk">
												<label for="l5_83" class="label--checkbox"><a href="/usedcar/bLE/s012/a83/index.html">熊本県<span class="areaNum">(22)</span></a></label>
																																																																																				<input type="checkbox" data-count="12" id="l5_84" value="84" class="js_areaChk">
												<label for="l5_84" class="label--checkbox"><a href="/usedcar/bLE/s012/a84/index.html">大分県<span class="areaNum">(12)</span></a></label>
																																																																																				<input type="checkbox" data-count="2" id="l5_82" value="82" class="js_areaChk">
												<label for="l5_82" class="label--checkbox"><a href="/usedcar/bLE/s012/a82/index.html">長崎県<span class="areaNum">(2)</span></a></label>
																																															</div>
										</td>
									</tr>
									<tr>
										<td>
											<div class="tdBox">
																																																												<input type="checkbox" data-count="1" id="l5_85" value="85" class="js_areaChk">
												<label for="l5_85" class="label--checkbox"><a href="/usedcar/bLE/s012/a85/index.html">宮崎県<span class="areaNum">(1)</span></a></label>
																																																																																				<input type="checkbox" data-count="2" id="l5_86" value="86" class="js_areaChk">
												<label for="l5_86" class="label--checkbox"><a href="/usedcar/bLE/s012/a86/index.html">鹿児島県<span class="areaNum">(2)</span></a></label>
																																																																																				<input type="checkbox" data-count="9" id="l5_87" value="87" class="js_areaChk">
												<label for="l5_87" class="label--checkbox"><a href="/usedcar/bLE/s012/a87/index.html">沖縄県<span class="areaNum">(9)</span></a></label>
																																																											</div>
										</td>
									</tr>
								</tbody></table>
							</div>

							<div class="scrollLockWrap js-scrollLockWrap">
								<div class="areaAction js-scrollBar is-fixed">
									<button type="reset" class="btnClear" onclick="return area.onReset();">条件をクリア</button>
									<button type="submit" class="btnSearch--iconMiddle" onclick="return area.onsubmit();"><span id="totalCount">454</span>台 検索する</button>
								</div>
							</div>
						</form>

					</section>
				</section>
            </section>


            <section class="search-section">
                <div class="scrollBox">
                    <ul class="scrollBox__barTab">
                        <li class="scrollBox__barTab__list">
                            <a href="#LE_NN" data-brand="LE" data-key="NN" data-role="smoothScroll" class="js-val50on" title="レクサス(人気車)">人気車</a>
                        </li>
                        <li class="scrollBox__barTab__list">
                            <a href="#LE_EN" data-brand="LE" data-key="EN" data-role="smoothScroll" class="js-val50on" title="レクサス(英数)">英数</a>
                        </li>
                        <li class="scrollBox__barTab__list">
                            <a href="#LE_AA" data-brand="LE" data-key="AA" data-role="smoothScroll" class="js-val50on" title="レクサス(ア行)">ア行</a>
                        </li>
                        <li class="scrollBox__barTab__list">
                            <span>カ行</span>
                        </li>
                        <li class="scrollBox__barTab__list">
                            <a href="#LE_SA" data-brand="LE" data-key="SA" data-role="smoothScroll" class="js-val50on" title="レクサス(サ行)">サ行</a>
                        </li>
                        <li class="scrollBox__barTab__list">
                            <span>タ行</span>
                        </li>
                        <li class="scrollBox__barTab__list">
                            <span>ナ行</span>
                        </li>
                        <li class="scrollBox__barTab__list">
                            <span>ハ行</span>
                        </li>
                        <li class="scrollBox__barTab__list">
                            <span>マ行</span>
                        </li>
                        <li class="scrollBox__barTab__list">
                            <span>ヤ行</span>
                        </li>
                        <li class="scrollBox__barTab__list">
                            <span>ラ行</span>
                        </li>
                        <li class="scrollBox__barTab__list">
                            <span>ワ行</span>
                        </li>
                    </ul>
                </div>

            </section>

            <!-- 他のセクションも同様 -->
        </main>
    </div>
</template>
<style>
.lastSelectBox {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    margin-bottom: 30px;
    padding: 15px 25px;
    border-radius: 3px;
    background-color: #f5f4f0
}

.lastSelectBox__title {
    margin-right: 25px;
    font-weight: bold
}

.lastSelectBox .btnFunc--middle {
    overflow: hidden;
    white-space: nowrap;
    word-wrap: normal;
    text-overflow: ellipsis;
    max-width: 800px
}

.selectArea {
    margin-bottom: 32px
}

.selectArea__title {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    -webkit-box-align: start;
    -webkit-align-items: flex-start;
    align-items: flex-start
}

.selectArea__title__heading {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: end;
    -webkit-align-items: flex-end;
    align-items: flex-end
}

.selectArea__title__heading>.subText {
    display: inline-block;
    margin-bottom: 15px
}

.areaAction {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    width: 980px;
    padding: 22px 0;
    background-color: rgba(255,255,255,.8)
}

.areaAction.is-fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 22px 0;
    border-top: 1px solid #e3e1dc;
    z-index: 10
}

.areaAction button:first-child {
    margin-right: 10px
}

.scrollLockWrap {
    position: relative;
    height: 91px;
    margin-bottom: 8px
}






.areaTable {
    position: relative;
    width: 100%;
    border: 1px solid #e3e1dc;
    background-color: #fff
}

.areaTable .row2 th input[type=checkbox]+.label--checkbox {
    padding: 37px 0px 37px 57px
}

.areaTable tr {
    border-top: 1px solid #e3e1dc
}

.areaTable th {
    width: 169px;
    background-color: #f5f4f0;
    font-weight: bold
}

.areaTable th>label a {
    display: inline-block;
    vertical-align: bottom
}

.areaTable th input[type=checkbox]+.label--checkbox {
    width: 100%;
    height: auto;
    padding: 10px 57px;
    line-height: 1.5
}

.areaTable th input[type=checkbox]+.label--checkbox::before {
    top: 50%;
    left: 30px;
    margin-top: -10px
}

.areaTable th input[type=checkbox]+.label--checkbox::after {
    top: 50%;
    left: 27px;
    margin-top: -13px
}

.areaTable th input[type=checkbox]+.label--checkbox:hover {
    background-color: #fff2e6
}

.areaTable th input[type=checkbox]:checked+.label--checkbox {
    background-color: #fff2e6
}

.areaTable th input[type=checkbox]:disabled+.label--checkbox:hover {
    background-color: inherit
}

.areaTable th .areaNum {
    display: block;
    font-size: 10px;
    font-weight: normal
}

.areaTable td {
    font-weight: bold
}

.areaTable td .tdBox {
    width: 810px;
    height: 53px
}

.areaTable td input[type=checkbox]+.label--checkbox {
    float: left;
    width: 162px;
    height: auto;
    line-height: 1.5;
    padding: 17px 0px 18px 35px
}

.areaTable td input[type=checkbox]+.label--checkbox::before {
    top: 50%;
    left: 8px;
    margin-top: -10px
}

.areaTable td input[type=checkbox]+.label--checkbox::after {
    top: 50%;
    left: 5px;
    margin-top: -13px
}

.areaTable td input[type=checkbox]+.label--checkbox:hover {
    background-color: #fff2e6
}

.areaTable td input[type=checkbox]:checked+.label--checkbox {
    background-color: #fff2e6
}

.areaTable td input[type=checkbox]:disabled+.label--checkbox:hover {
    background-color: inherit
}

.areaTable td .areaNum {
    display: inline-block;
    margin-left: 6px;
    font-size: 10px;
    font-weight: normal
}




input[type=checkbox] {
    display: none
}

input[type=checkbox]+.label--checkbox {
    position: relative;
    display: inline-block;
    height: 20px;
    line-height: 20px;
    padding-left: 27px;
    cursor: pointer
}

input[type=checkbox]+.label--checkbox::before {
    content: "";
    position: absolute;
    top: 0;
    left: 3px;
    width: 20px;
    height: 20px;
    box-shadow: 0px 6px 6px -7px #dbdbdb inset;
    border-style: solid;
    border-width: 1px;
    border-color: #dedcd7;
    border-radius: 3px;
    background-color: #fff
}

input[type=checkbox]:checked+.label--checkbox::before {
    border: 1px solid #ff9500;
    background-color: #ff9500;
    box-shadow: none
}

input[type=checkbox]:checked+.label--checkbox::after {
    content: "";
    position: absolute;
    top: -3px;
    left: 0;
    width: 25px;
    height: 25px;
    background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIwLjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDMwIDMwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzMCAzMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQoJLnN0MXtmaWxsOiNGRjYwMTA7fQoJLnN0MntmaWxsOiNGRkE2MDA7fQoJLnN0M3tmaWxsOiNENkQ0RDA7fQoJLnN0NHtmaWxsOiM2NjY2NjY7fQo8L3N0eWxlPgo8ZyBpZD0i44Os44Kk44Ok44O8XzIiPgoJPGc+CgkJCgkJCTxpbWFnZSBzdHlsZT0ib3ZlcmZsb3c6dmlzaWJsZTtvcGFjaXR5OjAuMTsiIHdpZHRoPSIyNSIgaGVpZ2h0PSIyMyIgeGxpbms6aHJlZj0iZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCb0FBQUFZQ0FZQUFBRGtndTNGQUFBQUNYQklXWE1BQUFzU0FBQUxFZ0hTM1g3OEFBQUEKR1hSRldIUlRiMlowZDJGeVpRQkJaRzlpWlNCSmJXRm5aVkpsWVdSNWNjbGxQQUFBQWhsSlJFRlVlTnJNbFd0UDAyQVlocnV0TUREagpxSGdJSGdrS0tFUmo0di8vQWNaRE5DcW9FVUVURk9OQW1MUWIzVjd2eDF3MVQ1cHRPTGNQTnJuU3B1L2hmZzczMjBiUjZLNFM5QndjCmhVRFo3UlZFaC92SWhFd2dGaE5pbkhkTnlCRDhmVldHRkxITlo4UmxzU2pteFJnaUl4RXlrYXFZRmRmRlBiaUtVQUpaWHNKNHlFeHUKaUExeFgxeGpjd3VnRGtuZXIvZ2ZHbThSVDVPSmlUd1NkOFdjK0M0K2kwbVMrT09CK0F3M2hzSTdLL1U1ZXJJbUhsS3lLNkl0VXRIZwpudm4xY1IrcmxweE5nK3VMUlg0VGdUVkViTzYrZUM4KzhKeDRtOGQ5ckdxTFc5Qm1iSmFHM3hHM3hTWG1mUld2eFhPeEpiNWg4VTR4Cm83ekJVK0lDTnJWM3grS0hhL0lpL1ZpblJ4YlVnZGdVVDhWTHNTdU94R214ZENYdU5hSmRZWk54blBORkhDSzBKQjR3WjQ1ZTJNYXYKeUdpWHdGbytHeTgwaGwxeko2MGlmSXhRblRsbTRXVnhrV2l0Wk8vRVc5eldWY1FMVlNqRE5KRmErUllZdXlWK1Vzb1o1clFKNEEzWgpmS1NFelc0aXVWQmdZVUxrZStJOE5sN0FBQ1ZIU2lZbThBd3hFejFobjlCTnFPTE9TOEQ3S1pGRkhMd2FWQm5QUlI2TEYyS0hrcDMyCkVpbCs2ekozNEJyVXVreEpxNVRrZ0o0OHdjcmJHS1hWcTJSRmUzZUlxTUc5NmM1UFJvOXFsSGJ6YjVyZlN5aHl2VXBabUpOeTBxZUkKZm92VFgrL1gvSDVDWHF6SnBoMnkrVVMvRWtUM3oycitJTC95TW1lbmlrakZ1VE10L3RpR0VmSWYyZnhERzF4Snc2RC9sMEhuaGVoLwp2bjRKTUFDbTc3alhBWmwwY1FBQUFBQkpSVTVFcmtKZ2dnPT0iIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIDEgMy4xIDUuMSkiPgoJCTwvaW1hZ2U+CgkJPGc+CgkJCTxwb2x5Z29uIGNsYXNzPSJzdDAiIHBvaW50cz0iMjMuOSw5LjggMjEuNyw4IDEzLjQsMTguNSA4LjgsMTQuOSA3LjEsMTcuMSAxMy44LDIyLjUgMTMuOCwyMi41IDEzLjgsMjIuNSAJCQkiLz4KCQk8L2c+Cgk8L2c+CjwvZz4KPGcgaWQ9IuODrOOCpOODpOODvF8zIj4KPC9nPgo8ZyBpZD0i44Os44Kk44Ok44O8XzQiPgo8L2c+Cjwvc3ZnPgo=) no-repeat
}

input[type=checkbox]:disabled+.label--checkbox {
    color: #ccc;
    cursor: default
}

input[type=checkbox]:disabled+.label--checkbox::before {
    box-shadow: none;
    border: 1px solid #ccc
}

input[type=checkbox]:checked:disabled+.label--checkbox::before {
    box-shadow: none;
    background-color: #fff
}

input[type=checkbox]:checked:disabled+.label--checkbox::after {
    content: "";
    display: block;
    position: absolute;
    top: 5px;
    left: 7px;
    width: 12px;
    height: 6px;
    border-left: 2px solid #ccc;
    border-bottom: 2px solid #ccc;
    -webkit-transform: rotate(-55deg);
    transform: rotate(-55deg)
}


.btnClear {
    line-height: 1;
    padding: 14px 18px;
    border-radius: 6px;
    background-image: -webkit-linear-gradient(top, #807d79 85%, #6d6c6b 100%);
    background-image: linear-gradient(to bottom, #807d79 85%, #6d6c6b 100%);
    box-shadow: 0px 1px 2px 0px rgba(0,0,0,.2);
    color: #fff;
    font-weight: bold
}

.btnClear:hover {
    background-image: -webkit-linear-gradient(top, #666461 85%, #4e4a4a 100%);
    background-image: linear-gradient(to bottom, #666461 85%, #4e4a4a 100%)
}

.btnClear:focus {
    outline: none
}



.btnSearch--iconMiddle {
    padding: 5px 30px 6px;
    font-size: 14px
}

.btnSearch--iconMiddle span {
    font-family: arial;
    font-size: 22px
}

.btnSearch,.btnSearch--icon,.btnSearch--iconLarge,.btnSearch--iconMiddle,.btnSearch--iconSmall {
    padding: 10px 44px;
    border-radius: 6px;
    background-image: -webkit-linear-gradient(top, #ff9500 85%, rgb(243, 142, 0) 100%);
    background-image: linear-gradient(to bottom, #ff9500 85%, rgb(243, 142, 0) 100%);
    box-shadow: 0px 1px 2px 0px rgba(0,0,0,.2);
    color: #fff;
    font-size: 16px;
    font-weight: bold
}

.btnSearch:hover,.btnSearch--icon:hover,.btnSearch--iconLarge:hover,.btnSearch--iconMiddle:hover,.btnSearch--iconSmall:hover {
    background-image: -webkit-linear-gradient(top, #e68600 85%, #d77c00 100%);
    background-image: linear-gradient(to bottom, #e68600 85%, #d77c00 100%)
}

.btnSearch:focus,.btnSearch--icon:focus,.btnSearch--iconLarge:focus,.btnSearch--iconMiddle:focus,.btnSearch--iconSmall:focus {
    outline: none
}

.btnSearch.is-disabled,.is-disabled.btnSearch--icon,.is-disabled.btnSearch--iconLarge,.is-disabled.btnSearch--iconMiddle,.is-disabled.btnSearch--iconSmall {
    background: #ddd;
    box-shadow: none;
    cursor: default
}

.btnSearch:disabled,.btnSearch--icon:disabled,.btnSearch--iconLarge:disabled,.btnSearch--iconMiddle:disabled,.btnSearch--iconSmall:disabled {
    background: #ddd;
    box-shadow: none;
    cursor: default
}

.btnSearch--icon::before,.btnSearch--iconLarge::before,.btnSearch--iconMiddle::before,.btnSearch--iconSmall::before {
    margin-right: 12px;
    font-size: 16px;
    font-weight: bold
}

.btnSearch--iconSmall {
    padding: 5px 12px;
    font-size: 14px;
    vertical-align: sub
}

.btnSearch--iconSmall span {
    font-size: 10px
}

.btnSearch--iconSmall::before {
    margin-right: 5px
}
</style>