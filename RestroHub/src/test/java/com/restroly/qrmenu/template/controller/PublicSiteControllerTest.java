package com.restroly.qrmenu.template.controller;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class PublicSiteControllerTest {

  @Test
  void forwardedHostWinsAndPortAndWwwAreStripped() {
    assertThat(PublicSiteController.slugFromHost("spice-route.restroly.com:443", "internal"))
        .isEqualTo("spice-route");
    assertThat(PublicSiteController.slugFromHost("www.spice-route.restroly.com", "x"))
        .isEqualTo("spice-route");
    assertThat(PublicSiteController.slugFromHost("a.restroly.com, b.proxy.com", "x"))
        .isEqualTo("a");
  }

  @Test
  void fallsBackToServerName() {
    assertThat(PublicSiteController.slugFromHost(null, "ocean-grill.restroly.com"))
        .isEqualTo("ocean-grill");
    assertThat(PublicSiteController.slugFromHost(" ", "ocean-grill.restroly.com"))
        .isEqualTo("ocean-grill");
  }

  @Test
  void localhostAndIpsHaveNoSlug() {
    assertThat(PublicSiteController.slugFromHost(null, "localhost")).isNull();
    assertThat(PublicSiteController.slugFromHost("localhost:3000", "x")).isNull();
    assertThat(PublicSiteController.slugFromHost(null, "192.168.1.5")).isNull();
    assertThat(PublicSiteController.slugFromHost("10.0.0.1:8080", "x")).isNull();
    assertThat(PublicSiteController.slugFromHost(null, null)).isNull();
  }
}
