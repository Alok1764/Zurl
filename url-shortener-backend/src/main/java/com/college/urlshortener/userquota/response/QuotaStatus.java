package com.college.urlshortener.userquota.response;

public record QuotaStatus(
        int linksUsed,
        int linkLimit,
        int aliasesUsed,
        int aliasLimit
) {
    public int linksRemaining() { return Math.max(0, linkLimit - linksUsed); }
    public int aliasesRemaining() { return Math.max(0, aliasLimit - aliasesUsed); }
    public boolean isLinkLimitReached() { return linksUsed >= linkLimit; }
    public boolean isAliasLimitReached() { return aliasesUsed >= aliasLimit; }
}
