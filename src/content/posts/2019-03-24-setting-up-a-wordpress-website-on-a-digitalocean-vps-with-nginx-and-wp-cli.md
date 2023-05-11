---
date: 2019-03-24
title: Setting Up a WordPress Website on a DigitalOcean VPS with NGinX and WP-CLI
image: digitalocean.png
categories: WordPress
tags: digitalocean,droplet,wordpress,wp-cli
---
To a lot of developers, making the switch from a one-click shared host to a custom VPS can be scary. With a VPS, you are your own support, yet you get total control over your server. Let's set up a simple WordPress site on a LEMP (Linux, NginX, MySQL, PHP) DigitalOcean droplet!

If you don't already have an account with [DigitalOcean](https://www.digitalocean.com) and want to get started for free, head on over to the [Promotions](/promotions) page. There, you will find a promotional link for free DigitalOcean credit! At the time of writing this post, you will receive $100 in credit to use in your first 60 days on DigitalOcean!

## Setting Up a new Server

On DigitalOcean, servers are referred to as droplets. Each droplet is your own personal server. This means that, compared to a shared host, you don't have to worry about someone running an app that completely crashes your site. If they mess up their droplet, yours is perfectly fine!

To create a new droplet, click **Create** on the top of the page, and select **Droplet**.

![Create a new DigitalOcean Droplet](assets/images/create-new-droplet.png)

The first item in the droplet wizard is to select your image. You could select your own flavor of Linux and start from scratch. However, let's make this super easy and let DigitalOcean setup the LEMP stack for us. Switch to the **Marketplace** tab and select **LEMP**.

*Note: If you want a quick WordPress site and don't care about using NginX, you can choose the WordPress on 18.04 image. This tutorial is to show you how to setup WP_CLI and run multiple WordPress sites off of NginX*

![Create LEMP](assets/images/marketplace-lemp.png)

Next, select your plan. You're most likely going to want the **Standard** plan instead of a high-performance plan. For a simple WordPress site, the $5/mo droplet is just fine. You can always change it later to add more power if you need to!

![Choose your droplet plan](assets/images/choose-droplet-plan.png)

I highly suggest adding the automatic backups. These cost $1/mo, and will take a snapshot of your entire droplet weekly. This can be very helpful in case you need to restore your server at some point.

Next, choose a data center near you. I chose New York, as I'm located on the east coast of the US. The different numbers don't make a difference, they are just different locations.

![Choose your datacenter](assets/images/choose-datacenter.png)

Now all you have to do to create your droplet is to finalize it. Give it a name that will be easy to remember what is running on this droplet.

![Finalize your droplet](assets/images/finalize-droplet.png)

## Setting Up the WordPress Website

Once your droplet has been created, you will be emailed the IP address and password for the root access to the droplet. Let's SSH into the droplet, update the root password, and create our user account!

```bash
ssh root@134.209.40.220
```

Once you are logged in, the droplet will automatically ask you for a new root password. **Also, take note as to where you can find your MySQL password**. Next, let's create our user account.

```bash
adduser cperko
```

You will be prompted to give the user a password, and set a few details about the user. Next, let's grant the user sudo access, so we can use root-level commands and permissions when we need them.

```bash
usermod -aG sudo cperko
```

Now that we have *sudo* access, let's log out of the root user and log back in as ourselves.

```bash
exit

ssh cperko@134.209.40.220
```

## Installing the WP-CLI

The [WordPress Command Line Interface](https://wp-cli.org/) will be used to install WordPress. It can do a ton of other helpful things, such as re-saving all images if you add new sizes to an existing site. The WP-CLI website mentions in detail how to setup the CLI. Here is a condensed version of what you will type into your shell:

```bash
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
 
php wp-cli.phar --info
 
chmod +x wp-cli.phar
sudo mv wp-cli.phar /usr/local/bin/wp
```

## Creating a New WordPress Website

Now that the CLI is installed on our droplet, let's use it to create all of the necessary WordPress files. Navigate to where your site will live **/var/www** and create a new directory for your website. We will run a couple of commands to give nginx permissions over the website, and allow us to create files in the directory. Then, use the WP-CLI to generate your files.

```bash
cd /var/www
 
sudo mkdir mynewsite
sudo chown www-data:www-data mynewsite
sudo chmod a+w mynewsite
 
cd mynewsite
 
wp core download
```

All of the core WordPress files have now been downloaded. Pretty neat, right?

![WordPress has been downloaded](assets/images/wp-downloaded.png)

## Setup the Database

Now before we can start setting up the WordPress config, we need to create a database for our site. DigitalOcean has already installed MySQL.

When you first logged into your droplet, you may have noticed a lot of text. One thing that it displayed was the location of the MySQL root password. It is typically found here: */root/.digitalocean_password*. Open this file up in the editor of your choice (using sudo), and copy the password.

```bash
sudo vim /root/.digitalocean_password
```

Log into the mysql database as the root user with the -p paragraph tag. You will then be prompted for the password.

```bash
sudo mysql -u root -p
```

Next, let's add the database for our new site. We will also want to create a user with permissions to only this database. This user will be what we put into our WordPress configuration file.

```bash
create database mynewsitedb;
 
create user 'mynewsiteuser'@'localhost' identified by 'secretpassword';
 
grant all privileges on mynewsitedb.* to 'mynewsiteuser'@'localhost';
```

## Setup the WordPress Config

Let's go back to our WordPress installation if you're not already there, and create a copy of the sample configuration file to give us a starting point on our config.

```bash
cd /var/www/mynewsite

cp wp-config-sample.php wp-config.php
```

Update the *wp-config.php* file with your database credentials.

![Update the wp-config.php](assets/images/wp-config.png)

## Setup NginX

Lastly, we will update NginX to know about our new site. This will allow incoming traffic for this site to be routed to the correct installation of WordPress. If you are hosting multiple sites, this is how you will set up each site separately. Let's navigate to the NginX *sites_available* directory. Copy the digitalocean file to a new one, called mynewsite. Open the file up to edit a few lines (I'm using vim here to edit my file).

```bash
cd /etc/nginx/sites_available
 
sudo cp digitalocean mynewsite
 
sudo vim mynewsite
```

![NGinX Config](assets/images/nginxconfig.png)

Simply change the *root* to the directory where your WordPress site lives, and the server_name to the domain of the new site. Also, comment out the *listen* lines, as we already have Nginx listening on these ports. Save and close the config file.

Now, create a symbolic link between our new configuration file in the sites_available directory, and the sites_enabled directory. *Make sure that you use full paths in the following command*:

```bash
sudo ln -s /etc/nginx/sites_available/mynewsite /etc/nginx/sites_enabled
```

Let's test the nginx config to make sure everything is good to go:

```bash
sudo nginx -t
```

Last step, we need to restart nginx in order for it to pick up on our configuration changes:

```bash
sudo service nginx restart
```

Navigate to your website in your browser, and you should see the installation screen. Congratulations! You now have a fully functioning WordPress installation running on your very own LEMP droplet!

![WordPress Installation Page](/assets/images/wp-installation-page.png)

**Troubleshooting**: If your browser is not directing you to your droplet, it could be a DNS issue. If this is a public domain, make sure your domain is pointed to the droplet's IP address. If you are just messing around like I am here with a fake URL, you will need to edit your *hosts* file on your local computer to point to your droplet.

If you want to setup a 2nd site on this same droplet, you now know everything you need in order to do so:

* Create the site files in */var/www/[otherSiteName]*
* Setup the database and database user
* Create a new nginx config file and link it
* Restart nginx